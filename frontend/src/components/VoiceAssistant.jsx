import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const LANGUAGES = [
  { code: 'hi-IN', label: 'हिंदी (Hindi)' },
  { code: 'en-IN', label: 'English' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'pa-IN', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as-IN', label: 'অসমীয়া (Assamese)' },
  { code: 'ur-IN', label: 'اردو (Urdu)' },
  { code: 'mai-IN',label: 'मैथिली (Maithili)' },
  { code: 'sat-IN',label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)' }
];

// Contextual phrases per route
const PHRASES = {
  "/": {
    "en-IN": "Welcome to Sanjeevani. Your trusted partner in agriculture. Please click Login or Get Started.",
    "hi-IN": "संजीवनी में आपका स्वागत है। कृपया लॉगिन पर क्लिक करें।",
    "mr-IN": "संजीवनी मध्ये आपले स्वागत आहे. कृपया लॉगिन वर क्लिक करा.",
    "pa-IN": "ਸੰਜੀਵਨੀ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਲੌਗਇਨ ਤੇ ਕਲਿਕ ਕਰੋ।",
    "gu-IN": "સંજીવનીમાં તમારું સ્વાગત છે. કૃપા કરીને લૉગિન પર ક્લિક કરો.",
    "ta-IN": "சஞ்சீவனிக்கு உங்களை வரவேற்கிறோம். தயவுசெய்து உள்நுழையவும்.",
    "te-IN": "సంజీవనికి స్వాగతం. దయచేసి లాగిన్ చేయండి.",
    "bn-IN": "সঞ্জীবনীতে স্বাগতম। অনুগ্রহ করে লগইন করুন।",
    "kn-IN": "ಸಂಜೀವನಿಗೆ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ.",
    "ml-IN": "സഞ്ജീവനിയിലേക്ക് സ്വാഗതം. ദയവായി ലോഗിൻ ചെയ്യുക.",
    "default": "Welcome to Sanjeevani. Please click Login."
  },
  "/login": {
    "en-IN": "Please add your information or use the quick login buttons to access your account.",
    "hi-IN": "कृपया अपनी जानकारी दर्ज करें या जल्दी लॉगिन करने के लिए बटन का उपयोग करें।",
    "mr-IN": "कृपया तुमची माहिती प्रविष्ट करा किंवा द्रुत लॉगिन बटणे वापरा.",
    "pa-IN": "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ ਜਾਂ ਤੁਰੰਤ ਲੌਗਇਨ ਬਟਨ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
    "gu-IN": "કૃપા કરીને તમારી માહિતી ઉમેરો અથવા ઝડપી લોગિન બટનોનો ઉપયોગ કરો.",
    "ta-IN": "தயவுசெய்து உங்கள் தகவலை உள்ளிடவும்.",
    "te-IN": "దయచేసి మీ సమాచారాన్ని నమోదు చేయండి.",
    "bn-IN": "অনুগ্রহ করে আপনার তথ্য দিন।",
    "kn-IN": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ.",
    "ml-IN": "ദയവായി നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക.",
    "default": "Please enter your login information."
  },
  "/farmer/dashboard": {
    "en-IN": "Welcome to your dashboard. You can scan crops for disease, check your Trust Score, and apply for a loan from here.",
    "hi-IN": "डैशबोर्ड में आपका स्वागत है। आप यहाँ से फसल स्कैन कर सकते हैं, अपना ट्रस्ट स्कोर देख सकते हैं और ऋण के लिए आवेदन कर सकते हैं।",
    "mr-IN": "तुमच्या डॅशबोर्डवर स्वागत आहे. तुम्ही येथून पीक स्कॅन करू शकता, तुमचा ट्रस्ट स्कोअर तपासू शकता आणि कर्जासाठी अर्ज करू शकता.",
    "pa-IN": "ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਤੁਸੀਂ ਇੱਥੋਂ ਫਸਲਾਂ ਨੂੰ ਸਕੈਨ ਕਰ ਸਕਦੇ ਹੋ ਅਤੇ ਕਰਜ਼ੇ ਲਈ ਅਰਜ਼ੀ ਦੇ ਸਕਦੇ ਹੋ।",
    "gu-IN": "તમારા ડેશબોર્ડમાં સ્વાગત છે. તમે પાકને સ્કેન કરી શકો છો અને લોન માટે અરજી કરી શકો છો.",
    "ta-IN": "உங்கள் டாஷ்போர்டுக்கு வரவேற்கிறோம். பயிர்களை ஸ்கேன் செய்து கடன் பெற விண்ணப்பிக்கலாம்.",
    "te-IN": "మీ డాష్‌బోర్డ్‌కు స్వాగతం. మీరు పంటలను స్కాన్ చేసి రుణం కోసం దరఖాస్తు చేసుకోవచ్చు.",
    "bn-IN": "আপনার ড্যাশবোর্ডে স্বাগতম। আপনি ফসল স্ক্যান করতে পারেন এবং ঋণের জন্য আবেদন করতে পারেন।",
    "kn-IN": "ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸ್ವಾಗತ. ನೀವು ಬೆಳೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಬಹುದು ಮತ್ತು ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.",
    "ml-IN": "നിങ്ങളുടെ ഡാഷ്‌ബോർഡിലേക്ക് സ്വാഗതം. നിങ്ങൾക്ക് വിളകൾ സ്കാൻ ചെയ്യാനും വായ്പയ്ക്ക് അപേക്ഷിക്കാനും കഴിയും.",
    "default": "Welcome to your dashboard. Scan crops, view your trust score, and request a loan."
  },
  "/farmer/scan": {
    "en-IN": "Take or upload a clear photo of your crop leaf for disease analysis.",
    "hi-IN": "बीमारी के विश्लेषण के लिए अपनी फसल के पत्ते की एक साफ फोटो लें या अपलोड करें।",
    "mr-IN": "रोग विश्लेषणासाठी तुमच्या पिकाच्या पानाचा स्पष्ट फोटो घ्या किंवा अपलोड करा.",
    "ta-IN": "உங்கள் பயிரின் புகைப்படத்தை பதிவேற்றவும்.",
    "te-IN": "దయచేసి మీ పంట ఫోటోను అప్‌లోడ్ చేయండి.",
    "bn-IN": "আপনার ফসলের একটি ছবি আপলোড করুন।",
    "kn-IN": "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬೆಳೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    "ml-IN": "നിങ്ങളുടെ വിളയുടെ ഒരു ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
    "default": "Take a clear photo of your crop leaf."
  },
  "/farmer/vouch": {
    "en-IN": "Request support from community members to increase your Trust Score.",
    "hi-IN": "अपना ट्रस्ट स्कोर बढ़ाने के लिए समुदाय के सदस्यों से समर्थन का अनुरोध करें।",
    "mr-IN": "तुमचा ट्रस्ट स्कोअर वाढवण्यासाठी समुदाय सदस्यांकडून शिफारसीची विनंती करा.",
    "pa-IN": "ਆਪਣਾ ਟਰੱਸਟ ਸਕੋਰ ਵਧਾਉਣ ਲਈ ਕਮਿਊਨਿਟੀ ਮੈਂਬਰਾਂ ਤੋਂ ਸਮਰਥਨ ਦੀ ਬੇਨਤੀ ਕਰੋ।",
    "gu-IN": "તમારો ટ્રસ્ટ સ્કોર વધારવા માટે સમુદાયના સભ્યો પાસેથી સમર્થનની વિનંતી કરો.",
    "ta-IN": "சமூக உறுப்பினர்களிடமிருந்து ஆதரவைக் கோருங்கள்.",
    "te-IN": "దయచేసి సంఘం సభ్యుల నుండి మద్దతును కోరండి.",
    "bn-IN": "কমিউনিটি সদস্যদের কাছ থেকে সমর্থন অনুরোধ করুন।",
    "kn-IN": "ಸಮುದಾಯದ ಸದಸ್ಯರಿಂದ ಬೆಂಬಲವನ್ನು ವಿನಂತಿಸಿ.",
    "ml-IN": "കമ്മ്യൂണിറ്റി അംഗങ്ങളിൽ നിന്ന് പിന്തുണ അഭ്യർത്ഥിക്കുക.",
    "default": "Request support from community members."
  },
  "/farmer/loan": {
    "en-IN": "Enter the loan amount you need and select the purpose.",
    "hi-IN": "जितनी ऋण राशि की आपको आवश्यकता है उसे दर्ज करें और उद्देश्य चुनें।",
    "mr-IN": "तुम्हाला आवश्यक असलेली कर्जाची रक्कम प्रविष्ट करा आणि उद्देश निवडा.",
    "ta-IN": "கடன் தொகையை உள்ளிடவும்.",
    "te-IN": "లోన్ మొత్తాన్ని నమోదు చేయండి.",
    "bn-IN": "ঋণের পরিমাণ লিখুন।",
    "kn-IN": "ಸಾಲದ ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ.",
    "ml-IN": "വായ്പാ തുക നൽകുക.",
    "default": "Enter the loan amount and select the purpose."
  },
  "/farmer/disclose": {
    "en-IN": "Review exactly what data you are sharing with the bank before submitting.",
    "hi-IN": "सबमिट करने से पहले ठीक से जांच लें कि आप बैंक के साथ कौन सा डेटा साझा कर रहे हैं।",
    "mr-IN": "सबमिट करण्यापूर्वी तुम्ही बँकेसोबत कोणता डेटा शेअर करत आहात याचे पुनरावलोकन करा.",
    "ta-IN": "நீங்கள் பகிரும் தரவை மதிப்பாய்வு செய்யவும்.",
    "te-IN": "దయచేసి మీరు పంచుకునే డేటాను సమీక్షించండి.",
    "bn-IN": "আপনি কী ডেটা শেয়ার করছেন তা পর্যালোচনা করুন।",
    "kn-IN": "ನೀವು ಹಂಚಿಕೊಳ್ಳುತ್ತಿರುವ ಡೇಟಾವನ್ನು ಪರಿಶೀಲಿಸಿ.",
    "ml-IN": "നിങ്ങൾ പങ്കിടുന്ന ഡാറ്റ അവലോകനം ചെയ്യുക.",
    "default": "Review what data you are sharing."
  },
  "/farmer/status": {
    "en-IN": "Check your current loan status here.",
    "hi-IN": "यहाँ अपनी वर्तमान ऋण स्थिति की जाँच करें।",
    "mr-IN": "तुमची सध्याची कर्ज स्थिती येथे तपासा.",
    "ta-IN": "உங்கள் தற்போதைய கடன் நிலையை இங்கே சரிபார்க்கவும்.",
    "te-IN": "మీ ప్రస్తుత రుణ స్థితిని ఇక్కడ తనిఖీ చేయండి.",
    "bn-IN": "এখানে আপনার বর্তমান ঋণের স্থিতি পরীক্ষা করুন।",
    "kn-IN": "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಾಲದ ಸ್ಥಿತಿಯನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.",
    "ml-IN": "നിങ്ങളുടെ നിലവിലെ വായ്പാ സ്ഥിതി ഇവിടെ പരിശോധിക്കുക.",
    "default": "Check your current loan status here."
  },
  "fraud_rejected": {
    "en-IN": "This image has been rejected by our anti-fraud system. Please upload a real photo.",
    "hi-IN": "हमारे एंटी-फ्रॉड सिस्टम ने इस छवि को अस्वीकार कर दिया है। कृपया एक असली फोटो अपलोड करें।",
    "mr-IN": "आमच्या अँटी-फ्रॉड सिस्टमने ही प्रतिमा नाकारली आहे. कृपया खरा फोटो अपलोड करा.",
    "pa-IN": "ਸਾਡੇ ਐਂਟੀ-ਫਰਾਡ ਸਿਸਟਮ ਦੁਆਰਾ ਇਸ ਚਿੱਤਰ ਨੂੰ ਰੱਦ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਅਸਲੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ।",
    "gu-IN": "અમારી એન્ટિ-ફ્રોડ સિસ્ટમ દ્વારા આ છબીને નકારી કાઢવામાં આવી છે. કૃપા કરીને વાસ્તવિક ફોટો અપલોડ કરો.",
    "ta-IN": "இந்த படம் நிராகரிக்கப்பட்டது. உண்மையான புகைப்படத்தை பதிவேற்றவும்.",
    "te-IN": "ఈ చిత్రం తిరస్కరించబడింది. దయచేసి నిజమైన ఫోటోను అప్‌లోడ్ చేయండి.",
    "bn-IN": "এই ছবি প্রত্যাখ্যান করা হয়েছে। একটি আসল ছবি আপলোড করুন।",
    "kn-IN": "ಈ ಚಿತ್ರವನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ. ನಿಜವಾದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    "ml-IN": "ഈ ചിത്രം നിരസിക്കപ്പെട്ടു. ഒരു യഥാർത്ഥ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
    "default": "Image rejected. Please upload a real photo."
  },
  "loan_submitted": {
    "en-IN": "Your loan application has been submitted successfully.",
    "hi-IN": "आपका ऋण आवेदन सफलतापूर्वक जमा कर दिया गया है।",
    "mr-IN": "तुमचा कर्ज अर्ज यशस्वीरित्या सबमिट केला गेला आहे.",
    "pa-IN": "ਤੁਹਾਡੀ ਕਰਜ਼ੇ ਦੀ ਅਰਜ਼ੀ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।",
    "gu-IN": "તમારી લોન અરજી સફળતાપૂર્વક સબમિટ થઈ ગઈ છે.",
    "ta-IN": "உங்கள் கடன் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
    "te-IN": "మీ రుణ దరఖాస్తు విజయవంతంగా సమర్పించబడింది.",
    "bn-IN": "আপনার ঋণের আবেদন সফলভাবে জমা দেওয়া হয়েছে।",
    "kn-IN": "ನಿಮ್ಮ ಸಾಲದ ಅರ್ಜಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ.",
    "ml-IN": "നിങ്ങളുടെ വായ്പാ അപേക്ഷ വിജയകരമായി സമർപ്പിച്ചു.",
    "default": "Loan application submitted."
  },
  "zkp_encrypting": {
    "en-IN": "Please wait a few seconds while we encrypt your data using Zero-Knowledge Proofs for your privacy.",
    "hi-IN": "कृपया कुछ सेकंड प्रतीक्षा करें। आपकी गोपनीयता के लिए हम आपका डेटा एन्क्रिप्ट कर रहे हैं।",
    "mr-IN": "कृपया काही सेकंद प्रतीक्षा करा. तुमच्या गोपनीयतेसाठी आम्ही तुमचा डेटा कूटबद्ध करत आहोत.",
    "pa-IN": "ਕਿਰਪਾ ਕਰਕੇ ਕੁਝ ਸਕਿੰਟ ਉਡੀਕ ਕਰੋ। ਤੁਹਾਡੀ ਗੋਪਨੀਯਤਾ ਲਈ ਅਸੀਂ ਤੁਹਾਡਾ ਡੇਟਾ ਐਨਕ੍ਰਿਪਟ ਕਰ ਰਹੇ ਹਾਂ।",
    "gu-IN": "કૃપા કરીને થોડી સેકંડ રાહ જુઓ. તમારી ગોપનીયતા માટે અમે તમારો ડેટા એન્ક્રિપ્ટ કરી રહ્યા છીએ.",
    "ta-IN": "தயவுசெய்து காத்திருக்கவும், உங்கள் தரவை நாங்கள் குறியாக்கம் செய்கிறோம்.",
    "te-IN": "దయచేసి వేచి ఉండండి, మేము మీ డేటాను గుప్తీకరిస్తున్నాము.",
    "bn-IN": "অনুগ্রহ করে অপেক্ষা করুন, আমরা আপনার ডেটা এনক্রিপ্ট করছি।",
    "kn-IN": "ದಯವಿಟ್ಟು ಕಾಯಿರಿ, ನಾವು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡುತ್ತಿದ್ದೇವೆ.",
    "ml-IN": "ദയവായി കാത്തിരിക്കുക, ഞങ്ങൾ നിങ്ങളുടെ ഡാറ്റ എൻക്രിപ്റ്റ് ചെയ്യുന്നു.",
    "default": "Please wait while we encrypt your data."
  },
  "scan_complete": {
    "en-IN": "Scan complete. Please review the AI diagnosis of your crop.",
    "hi-IN": "स्कैन पूरा हुआ। कृपया अपनी फसल के एआई निदान की जांच करें।",
    "mr-IN": "स्कॅन पूर्ण झाले. कृपया तुमच्या पिकाच्या AI निदानाचे पुनरावलोकन करा.",
    "ta-IN": "ஸ்கேன் முடிந்தது. முடிவுகளைப் பார்க்கவும்.",
    "te-IN": "స్కాన్ పూర్తయింది. ఫలితాలను చూడండి.",
    "bn-IN": "স্ক্যান সম্পন্ন হয়েছে। ফলাফল দেখুন।",
    "kn-IN": "ಸ್ಕ್ಯಾನ್ ಪೂರ್ಣಗೊಂಡಿದೆ. ಫಲಿತಾಂಶಗಳನ್ನು ನೋಡಿ.",
    "ml-IN": "സ്കാൻ പൂർത്തിയായി. ഫലങ്ങൾ കാണുക.",
    "default": "Scan complete. Review diagnosis."
  }
};

export default function VoiceAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // Disable voice assistant on FPO routes
  const isFpoRoute = location.pathname.startsWith('/fpo');

  useEffect(() => {
    if (isFpoRoute) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback((customKey = null) => {
    window.speechSynthesis.cancel();
    
    // Find matching route or use custom event key
    const lookupKey = typeof customKey === 'string' ? customKey : location.pathname;
    let phraseDict = PHRASES[lookupKey];
    
    if (!phraseDict) {
      if (lookupKey.includes('status')) phraseDict = { 'en-IN': 'Check your current loan status here.', 'hi-IN': 'यहाँ अपनी वर्तमान ऋण स्थिति की जाँच करें।', default: 'Check your current loan status.' };
      else phraseDict = { 'en-IN': 'Sanjeevani Assistant ready. How can I help?', 'hi-IN': 'संजीवनी सहायक तैयार है। मैं आपकी कैसे मदद कर सकता हूँ?', default: 'Sanjeevani Assistant is ready.' };
    }
    
    // Fallback to default English if translation is missing for the language
    const text = phraseDict[lang] || phraseDict['default'];
    
    // Try to find a matching voice
    const matchingVoice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
    
    let textToSpeak = text;
    let voiceToUse = matchingVoice;

    if (!matchingVoice && lang !== 'en-IN') {
      // If we don't have a voice for the selected regional language (e.g., Tamil voice missing on this OS)
      // Do not try to read Tamil script with an English voice. Fallback to English text and English voice.
      textToSpeak = phraseDict['en-IN'] || phraseDict['default'];
      voiceToUse = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en')) || voices[0];
    } else if (!matchingVoice) {
      voiceToUse = voices[0];
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = matchingVoice ? lang : 'en-IN';
    if (voiceToUse) utterance.voice = voiceToUse;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [lang, location.pathname, voices]);

  // Listen for global custom events from other components
  useEffect(() => {
    const handleCustomSpeak = (e) => speak(e.detail);
    window.addEventListener('trigger-voice', handleCustomSpeak);
    return () => window.removeEventListener('trigger-voice', handleCustomSpeak);
  }, [speak]);

  // Auto-speak when route changes if language is selected
  useEffect(() => {
    speak();
    return () => window.speechSynthesis.cancel();
  }, [location.pathname, speak, isFpoRoute]);

  const toggleSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speak();
    }
  };

  if (isFpoRoute) return null;

  return (
    <div style={{ position: 'fixed', bottom: '100px', right: '24px', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      
      {/* Menu */}
      {isOpen && (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', width: '220px', animation: 'slideUp 0.2s ease-out' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Voice Assistant Language</div>
          <select 
            value={lang} 
            onChange={(e) => {
              const newLang = e.target.value;
              setLang(newLang);
              
              // --- TRIGGER GOOGLE TRANSLATE ENGINE ---
              const googleLangCode = newLang.split('-')[0];
              const gtSelect = document.querySelector('.goog-te-combo');
              if (gtSelect) {
                gtSelect.value = googleLangCode;
                gtSelect.dispatchEvent(new Event('change'));
              }
            }}
            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#f8fafc', cursor: 'pointer' }}
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', lineHeight: 1.4 }}>
            Sanjeevani detects context and reads instructions aloud in your local language.
          </div>
        </div>
      )}

      {/* FABs */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ width: '48px', height: '48px', borderRadius: '24px', background: '#fff', border: '2px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '20px' }}>
          🌐
        </button>
        <button 
          onClick={toggleSpeaking}
          style={{ width: '56px', height: '56px', borderRadius: '28px', background: isSpeaking ? '#dc2626' : '#16a34a', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: isSpeaking ? '0 0 20px rgba(220,38,38,0.4)' : '0 4px 16px rgba(22,163,74,0.3)', transition: 'all 0.2s', position: 'relative' }}>
          {isSpeaking && <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid #dc2626', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>}
          <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, fill: 'currentColor', position: 'relative' }}>
            {isSpeaking ? (
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            ) : (
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            )}
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ping { 75%, 100% { transform: scale(1.3); opacity: 0; } }
      `}</style>
    </div>
  );
}
