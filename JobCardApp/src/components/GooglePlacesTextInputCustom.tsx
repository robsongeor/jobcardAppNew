import {
    forwardRef,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import type { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import {
    ActivityIndicator,
    FlatList,
    I18nManager,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Import the API functions
import {
    fetchPlaceDetails as fetchPlaceDetailsApi,
    fetchPredictions as fetchPredictionsApi,
    generateUUID,
    isRTLText,
} from './services/googlePlacesApi';
import SearchBar, { SearchBarProps } from './SearchBar';

// Type definitions
interface PlaceStructuredFormat {
    mainText: {
        text: string;
    };
    secondaryText?: {
        text: string;
    };
}

interface PlacePrediction {
    placeId: string;
    structuredFormat: PlaceStructuredFormat;
    types: string[];
}

interface PlaceDetailsFields {
    [key: string]: any;
}

interface Place {
    placeId: string;
    structuredFormat: PlaceStructuredFormat;
    types: string[];
    details?: PlaceDetailsFields; // ✅ Optional details when fetchDetails is true
}

interface GooglePlacesTextInputStyles {
    container?: StyleProp<ViewStyle>;
    input?: StyleProp<TextStyle>;
    suggestionsContainer?: StyleProp<ViewStyle>;
    suggestionsList?: StyleProp<ViewStyle>;
    suggestionItem?: StyleProp<ViewStyle>;
    suggestionText?: {
        main?: StyleProp<TextStyle>;
        secondary?: StyleProp<TextStyle>;
    };
    loadingIndicator?: {
        color?: string; // ✅ Keep as string, not StyleProp
    };
    placeholder?: {
        color?: string; // ✅ Keep as string, not StyleProp
    };
}

interface GooglePlacesTextInputProps {
    apiKey: string;
    value?: string;
    placeHolderText?: string;
    proxyUrl?: string;
    languageCode?: string;
    includedRegionCodes?: string[];
    types?: string[];
    biasPrefixText?: (text: string) => string; // ✅ Function that transforms text
    minCharsToFetch?: number;
    onPlaceSelect: (place: Place, sessionToken?: string | null) => void; // ✅ Remove | null
    onTextChange?: (text: string) => void;
    debounceDelay?: number;
    showLoadingIndicator?: boolean;
    showClearButton?: boolean;
    forceRTL?: boolean;
    style?: GooglePlacesTextInputStyles;
    hideOnKeyboardDismiss?: boolean;
    fetchDetails?: boolean;
    detailsProxyUrl?: string | null; // ✅ Add | null to match JS
    detailsFields?: string[];
    onError?: (error: any) => void;
    enableDebug?: boolean; // ✅ Add debug prop
    resultsVisible: boolean;
    onFocus?: () => void;
    searchInput: (inputProps: SearchBarProps) => React.ReactNode;
}

interface GooglePlacesTextInputRef {
    clear: () => void;
    focus: () => void;
    getSessionToken: () => string | null;
}

interface PredictionItem {
    placePrediction: PlacePrediction;
}

const GooglePlacesTextInput = forwardRef<
    GooglePlacesTextInputRef,
    GooglePlacesTextInputProps
>(
    (
        {
            apiKey,
            value,
            placeHolderText,
            proxyUrl,
            languageCode,
            includedRegionCodes,
            types = [],
            biasPrefixText,
            minCharsToFetch = 1,
            onPlaceSelect,
            onTextChange,
            debounceDelay = 200,
            showLoadingIndicator = true,
            showClearButton = true,
            forceRTL = undefined,
            style = {},
            hideOnKeyboardDismiss = false,
            fetchDetails = false,
            detailsProxyUrl = null,
            detailsFields = [],
            onError,
            enableDebug = false,
            resultsVisible,
            onFocus,
            searchInput,
        },
        ref,

    ) => {
        const [predictions, setPredictions] = useState<PredictionItem[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [inputText, setInputText] = useState<string>(value || '');
        const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
        const [sessionToken, setSessionToken] = useState<string | null>(null);
        const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
        const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
        const inputRef = useRef<TextInput>(null);
        const suggestionPressing = useRef<boolean>(false);
        const skipNextFocusFetch = useRef<boolean>(false);

        const generateSessionToken = (): string => {
            return generateUUID();
        };

        // Initialize session token on mount
        useEffect(() => {
            setSessionToken(generateSessionToken());

            return () => {
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }
            };
        }, []);

        // Add keyboard listener
        useEffect(() => {
            if (hideOnKeyboardDismiss) {
                const keyboardDidHideSubscription = Keyboard.addListener(
                    'keyboardDidHide',
                    () => setShowSuggestions(false)
                );

                return () => {
                    keyboardDidHideSubscription.remove();
                };
            }
            return () => { };
        }, [hideOnKeyboardDismiss]);

        // Expose methods to parent through ref
        useImperativeHandle(ref, () => ({
            clear: () => {
                if (debounceTimeout.current) {
                    clearTimeout(debounceTimeout.current);
                }
                skipNextFocusFetch.current = true;
                setInputText('');
                setPredictions([]);
                setShowSuggestions(false);
                setSessionToken(generateSessionToken());
            },
            focus: () => {
                inputRef.current?.focus();
            },
            getSessionToken: () => sessionToken,
        }));

        // RTL detection logic
        const isRTL =
            forceRTL !== undefined ? forceRTL : isRTLText(placeHolderText ?? '');

        // Add missing CORS warning effect
        useEffect(() => {
            if (Platform.OS === 'web' && fetchDetails && !detailsProxyUrl) {
                console.warn(
                    'Google Places Details API does not support CORS. ' +
                    'To fetch place details on web, provide a detailsProxyUrl prop that points to a CORS-enabled proxy.'
                );
            }
        }, [fetchDetails, detailsProxyUrl]);

        // Debug logger utility
        const debugLog = (category: string, message: string, data?: any) => {
            if (enableDebug) {
                const timestamp = new Date().toISOString();
                console.log(
                    `[GooglePlacesTextInput:${category}] ${timestamp} - ${message}`
                );
                if (data) {
                    console.log(`[GooglePlacesTextInput:${category}] Data:`, data);
                }
            }
        };

        const fetchPredictions = async (text: string): Promise<void> => {
            debugLog('PREDICTIONS', `Starting fetch for text: "${text}"`);
            debugLog('PREDICTIONS', 'Request params', {
                text,
                apiKey: apiKey ? '[PROVIDED]' : '[MISSING]', // ✅ Security fix
                proxyUrl,
                sessionToken,
                languageCode,
                includedRegionCodes,
                types,
                minCharsToFetch,
            });

            if (!text || text.length < minCharsToFetch) {
                debugLog(
                    'PREDICTIONS',
                    `Text too short (${text.length} < ${minCharsToFetch})`
                );
                setPredictions([]);
                return;
            }

            setLoading(true);

            const { error, predictions: fetchedPredictions } =
                await fetchPredictionsApi({
                    text,
                    apiKey,
                    proxyUrl,
                    sessionToken,
                    languageCode,
                    includedRegionCodes,
                    types,
                    biasPrefixText,
                });

            if (error) {
                debugLog('PREDICTIONS', 'API Error occurred', {
                    errorType: error.constructor.name,
                    errorMessage: error.message,
                    errorStack: error.stack,
                });
                onError?.(error);
                setPredictions([]);
            } else {
                debugLog(
                    'PREDICTIONS',
                    `Success: ${fetchedPredictions.length} predictions received`
                );
                debugLog('PREDICTIONS', 'Predictions data', fetchedPredictions);
                setPredictions(fetchedPredictions);
                setShowSuggestions(fetchedPredictions.length > 0);
            }

            setLoading(false);
        };

        const fetchPlaceDetails = async (
            placeId: string
        ): Promise<PlaceDetailsFields | null> => {
            debugLog('DETAILS', `Starting details fetch for placeId: ${placeId}`);
            debugLog('DETAILS', 'Request params', {
                placeId,
                apiKey: apiKey ? '[PROVIDED]' : '[MISSING]', // ✅ Security fix
                detailsProxyUrl,
                sessionToken,
                languageCode,
                detailsFields,
                fetchDetails,
                platform: Platform.OS,
            });

            if (!fetchDetails || !placeId) {
                debugLog('DETAILS', 'Skipping details fetch', {
                    fetchDetails,
                    placeId,
                });
                return null;
            }

            // Web CORS warning
            if (Platform.OS === 'web' && !detailsProxyUrl) {
                debugLog(
                    'DETAILS',
                    'WARNING: Web platform detected without detailsProxyUrl - CORS issues likely'
                );
            }

            setDetailsLoading(true);

            const { error, details } = await fetchPlaceDetailsApi({
                placeId,
                apiKey,
                detailsProxyUrl,
                sessionToken,
                languageCode,
                detailsFields,
            });

            setDetailsLoading(false);

            if (error) {
                debugLog('DETAILS', 'API Error occurred', {
                    errorType: error.constructor.name,
                    errorMessage: error.message,
                    errorStack: error.stack,
                });
                onError?.(error);
                return null;
            }

            debugLog('DETAILS', 'Success: Details received', details);
            return details;
        };

        const handleTextChange = (text: string): void => {
            setInputText(text);
            onTextChange?.(text);

            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }

            debounceTimeout.current = setTimeout(() => {
                fetchPredictions(text);
            }, debounceDelay);
        };

        const handleSuggestionPress = async (
            suggestion: PredictionItem
        ): Promise<void> => {
            const place = suggestion.placePrediction;
            debugLog(
                'SELECTION',
                `User selected place: ${place.structuredFormat.mainText.text}`
            );
            debugLog('SELECTION', 'Selected place data', place);

            setInputText(place.structuredFormat.mainText.text);
            setShowSuggestions(false);
            Keyboard.dismiss();

            if (fetchDetails) {
                debugLog('SELECTION', 'Fetching place details...');
                setLoading(true);
                const details = await fetchPlaceDetails(place.placeId);
                const enrichedPlace: Place = details ? { ...place, details } : place;

                debugLog(
                    'SELECTION',
                    'Final place object being sent to onPlaceSelect',
                    {
                        hasDetails: !!details,
                        placeKeys: Object.keys(enrichedPlace),
                        detailsKeys: details ? Object.keys(details) : null,
                    }
                );

                onPlaceSelect?.(enrichedPlace, sessionToken);
                setLoading(false);
            } else {
                debugLog(
                    'SELECTION',
                    'Sending place without details (fetchDetails=false)'
                );
                onPlaceSelect?.(place, sessionToken);
            }
            setSessionToken(generateSessionToken());
        };

        const handleFocus = (): void => {
            if (skipNextFocusFetch.current) {
                skipNextFocusFetch.current = false;
                return;
            }
            if (inputText.length >= minCharsToFetch) {
                fetchPredictions(inputText);
                setShowSuggestions(true);
            }
        };

        const renderSuggestion = ({ item }: { item: PredictionItem }) => {
            const { mainText, secondaryText } = item.placePrediction.structuredFormat;

            // Safely extract backgroundColor from style
            const suggestionsContainerStyle = StyleSheet.flatten(
                style.suggestionsContainer
            );
            const backgroundColor =
                suggestionsContainerStyle?.backgroundColor || '#efeff1';

            return (
                <TouchableOpacity
                    style={
                        [
                            styles.suggestionItem,
                            { backgroundColor },
                            style.suggestionItem,
                        ]}
                    onPress={() => {
                        suggestionPressing.current = false;
                        handleSuggestionPress(item);
                    }}
                    // Fix for web: onBlur fires before onPress, hiding suggestions too early.
                    {...(Platform.OS === 'web' &&
                        ({
                            onMouseDown: () => {
                                suggestionPressing.current = true;
                            },
                        } as any))
                    }
                >
                    <Text
                        style={
                            [
                                styles.mainText,
                                style.suggestionText?.main,
                                getTextAlign(),
                            ]
                        }
                    >
                        {mainText.text}
                    </Text>
                    {
                        secondaryText && (
                            <Text
                                style={
                                    [
                                        styles.secondaryText,
                                        style.suggestionText?.secondary,
                                        getTextAlign(),
                                    ]
                                }
                            >
                                {secondaryText.text}
                            </Text>
                        )
                    }
                </TouchableOpacity>
            );
        };

        const getPadding = () => {
            const physicalRTL = I18nManager.isRTL;
            const clearButtonPadding = showClearButton ? 75 : 45;
            if (isRTL !== physicalRTL) {
                return {
                    paddingStart: clearButtonPadding,
                    paddingEnd: 15,
                };
            }
            return {
                paddingStart: 15,
                paddingEnd: clearButtonPadding,
            };
        };

        const getTextAlign = () => {
            const isDeviceRTL = I18nManager.isRTL;
            if (isDeviceRTL) {
                return { textAlign: isRTL ? 'left' : ('right' as 'left' | 'right') };
            } else {
                return { textAlign: isRTL ? 'right' : ('left' as 'left' | 'right') };
            }
        };

        const getIconPosition = (paddingValue: number) => {
            const physicalRTL = I18nManager.isRTL;
            if (isRTL !== physicalRTL) {
                return { start: paddingValue };
            }
            return { end: paddingValue };
        };

        // Debug initialization
        useEffect(() => {
            if (enableDebug) {
                debugLog('INIT', 'Component initialized with props', {
                    apiKey: apiKey ? '[PROVIDED]' : '[MISSING]', // ✅ Security fix
                    fetchDetails,
                    detailsProxyUrl,
                    detailsFields,
                    platform: Platform.OS,
                    minCharsToFetch,
                    debounceDelay,
                });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []); // ✅ Only run on mount

        return (
            <View>
                {searchInput({
                    value: inputText,
                    onChangeText: handleTextChange,
                    handleSearch: handleFocus,
                    onFocus,
                    // any other props...
                })}

                <View>
                    {/* <TextInput
                        ref={inputRef}
                        style={[styles.input, style.input, getPadding(), getTextAlign()]}
                        placeholder={placeHolderText}
                        placeholderTextColor={style.placeholder?.color || '#666666'}
                        value={inputText}
                        onChangeText={handleTextChange}
                        onFocus={handleFocus}
                        onBlur={() => {
                            setTimeout(() => {
                                if (suggestionPressing.current) {
                                    suggestionPressing.current = false;
                                } else {
                                    setShowSuggestions(false);
                                }
                            }, 10);
                        }}
                        clearButtonMode="never" // Disable iOS native clear button
                    /> */}




                    {/* Loading indicator */}
                    {
                        (loading || detailsLoading) && showLoadingIndicator && (
                            <ActivityIndicator
                                style={[styles.loadingIndicator, getIconPosition(45)]}
                                size={'small'}
                                color={style.loadingIndicator?.color || '#000000'}
                            />
                        )
                    }
                </View>

                {resultsVisible && showSuggestions && predictions.length > 0 && (
                    <View style={[styles.suggestionsContainer, style.suggestionsContainer]}>
                        <FlatList
                            data={predictions}
                            renderItem={renderSuggestion}
                            keyExtractor={(item) => item.placePrediction.placeId
                            }
                            keyboardShouldPersistTaps="always"
                            style={style.suggestionsList}
                            scrollEnabled
                            bounces={false}
                            nestedScrollEnabled
                        />
                    </View>
                )}
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {},
    input: {
        height: 90,
        borderRadius: 6,
        borderWidth: 1,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        fontSize: 16,
    },
    suggestionsContainer: {
        backgroundColor: '#efeff1', // default background
        borderRadius: 6,
        marginTop: 3,
        overflow: 'hidden',
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#c8c7cc',
    },
    mainText: {
        fontSize: 16,
        textAlign: 'left',
        color: '#000000',
    },
    secondaryText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
        textAlign: 'left',
    },
    clearButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -13 }],
        padding: 0,
    },
    loadingIndicator: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    iOSclearButton: {
        fontSize: 18,
        fontWeight: '400',
        color: 'white',
        backgroundColor: '#999',
        width: 25,
        height: 25,
        borderRadius: 12.5,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 19,
        includeFontPadding: false,
    },
    androidClearButton: {
        fontSize: 24,
        fontWeight: '400',
        color: 'white',
        backgroundColor: '#999',
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 20,
        includeFontPadding: false,
    },
});

export type {
    GooglePlacesTextInputProps,
    GooglePlacesTextInputRef,
    GooglePlacesTextInputStyles,
    Place,
    PlaceDetailsFields,
    PlacePrediction,
    PlaceStructuredFormat,
};

export default GooglePlacesTextInput;
