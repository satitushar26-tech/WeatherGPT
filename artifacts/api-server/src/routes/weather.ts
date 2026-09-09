import { Router, type IRouter } from "express";
import {
  AskWeatherAssistantBody,
  AskWeatherAssistantResponse,
  GetClimateTrendsResponse,
  GetWeatherAlertsResponse,
  GetWeatherOverviewResponse,
} from "@workspace/api-zod";
import { findMatchingIndianState } from "../lib/india-states";

const router: IRouter = Router();

const alerts = [
  {
    id: "assam-flood-watch",
    type: "Flood",
    severity: "Watch",
    title: "River levels rising across lower Assam",
    location: "Dibrugarh, Assam",
    issued: "Today, 08:40",
    expires: "Tomorrow, 18:00",
    description:
      "Persistent rain upstream may cause localized flooding near low-lying river communities.",
    color: "amber",
  },
  {
    id: "odisha-cyclone",
    type: "Cyclone",
    severity: "Advisory",
    title: "Cyclonic circulation over the Bay of Bengal",
    location: "Coastal Odisha",
    issued: "Today, 06:15",
    expires: "Friday, 12:00",
    description:
      "Residents along the coast should monitor official bulletins and secure loose outdoor items.",
    color: "orange",
  },
  {
    id: "delhi-heat",
    type: "Heatwave",
    severity: "Information",
    title: "High afternoon temperatures expected",
    location: "Delhi NCR",
    issued: "Yesterday, 16:30",
    expires: "Tomorrow, 17:00",
    description:
      "Stay hydrated and avoid strenuous outdoor activity between noon and 4 PM.",
    color: "rose",
  },
  {
    id: "kerala-monsoon-watch",
    type: "Heavy Rain",
    severity: "Watch",
    title: "Vigorous monsoon surge along Malabar coast",
    location: "Kochi, Kerala",
    issued: "Today, 11:20",
    expires: "Saturday, 23:59",
    description:
      "Intense rainfall spells with gusty coastal winds expected across central and northern districts.",
    color: "amber",
  },
  {
    id: "ladakh-frost-advisory",
    type: "Cold Wave",
    severity: "Information",
    title: "Sub-zero overnight temperatures in high passes",
    location: "Leh, Ladakh",
    issued: "Today, 05:00",
    expires: "Sunday, 08:00",
    description:
      "Clear night skies leading to sudden drop in surface temperatures and black ice risk on mountain passes.",
    color: "rose",
  },
];

const climate = {
  location: "Kerala",
  period: "2025 monsoon season",
  rainfallChange: 8.4,
  temperatureChange: 0.6,
  points: [
    { month: "Jun", rainfall: 614, average: 650, temperature: 27.1 },
    { month: "Jul", rainfall: 756, average: 726, temperature: 26.8 },
    { month: "Aug", rainfall: 492, average: 419, temperature: 27.4 },
    { month: "Sep", rainfall: 318, average: 252, temperature: 27.8 },
    { month: "Oct", rainfall: 272, average: 289, temperature: 28.1 },
    { month: "Nov", rainfall: 164, average: 184, temperature: 28.4 },
  ],
};

const forecast = [
  {
    day: "Today",
    date: "Sep 09",
    icon: "partly-cloudy",
    high: 33,
    low: 26,
    rainChance: 24,
    rainfall: 1.2,
    condition: "Partly cloudy",
  },
  {
    day: "Tomorrow",
    date: "Sep 10",
    icon: "rain",
    high: 31,
    low: 25,
    rainChance: 78,
    rainfall: 14,
    condition: "Scattered showers",
  },
  {
    day: "Friday",
    date: "Sep 11",
    icon: "rain",
    high: 30,
    low: 25,
    rainChance: 64,
    rainfall: 9,
    condition: "Light rain",
  },
  {
    day: "Saturday",
    date: "Sep 12",
    icon: "sunny",
    high: 34,
    low: 26,
    rainChance: 18,
    rainfall: 0.4,
    condition: "Mostly sunny",
  },
  {
    day: "Sunday",
    date: "Sep 13",
    icon: "partly-cloudy",
    high: 33,
    low: 26,
    rainChance: 31,
    rainfall: 2.5,
    condition: "Partly cloudy",
  },
];

const overview = {
  location: "New Delhi",
  region: "Delhi, India",
  updatedAt: "Updated 4 min ago",
  temperature: 32,
  feelsLike: 35,
  condition: "Partly cloudy",
  conditionIcon: "partly-cloudy",
  high: 33,
  low: 26,
  rainChance: 24,
  humidity: 68,
  wind: 14,
  pressure: 1007,
  visibility: 8.2,
  uvIndex: 7.4,
  metrics: [
    { label: "Humidity", value: "68%", detail: "Feels humid", icon: "humidity" },
    { label: "Wind", value: "14 km/h", detail: "From the NW", icon: "wind" },
    { label: "Pressure", value: "1007 hPa", detail: "Steady", icon: "pressure" },
    { label: "Visibility", value: "8.2 km", detail: "Moderate", icon: "visibility" },
  ],
  forecast,
  alerts,
  climate,
};

router.get("/weather/overview", (_req, res) => {
  res.json(GetWeatherOverviewResponse.parse(overview));
});

router.get("/weather/alerts", (_req, res) => {
  res.json(GetWeatherAlertsResponse.parse(alerts));
});

router.get("/weather/climate", (_req, res) => {
  res.json(GetClimateTrendsResponse.parse(climate));
});

function detectLanguage(message: string, reqLang?: string): string {
  const norm = (reqLang || "").toLowerCase().trim();
  if (norm.includes("hindi") || norm === "hi") return "hi";
  if (norm.includes("marathi") || norm === "mr") return "mr";
  if (norm.includes("bengali") || norm === "bn") return "bn";
  if (norm.includes("tamil") || norm === "ta") return "ta";
  if (norm.includes("telugu") || norm === "te") return "te";
  if (norm.includes("gujarati") || norm === "gu") return "gu";
  if (norm.includes("kannada") || norm === "kn") return "kn";
  if (norm.includes("malayalam") || norm === "ml") return "ml";
  if (norm.includes("punjabi") || norm === "pa") return "pa";

  // Script detection fallback
  if (/[\u0B80-\u0BFF]/.test(message)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(message)) return "te";
  if (/[\u0A80-\u0AFF]/.test(message)) return "gu";
  if (/[\u0C80-\u0CFF]/.test(message)) return "kn";
  if (/[\u0D00-\u0D7F]/.test(message)) return "ml";
  if (/[\u0A00-\u0A7F]/.test(message)) return "pa";
  if (/[\u0980-\u09FF]/.test(message)) return "bn";
  if (/[\u0900-\u097F]/.test(message)) {
    if (/आहे|का|शेतात|पाऊस|उद्या|फवारणी/.test(message)) return "mr";
    return "hi";
  }

  return "en";
}

router.post("/weather/chat", (req, res) => {
  const parsed = AskWeatherAssistantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please enter a weather question." });
    return;
  }

  const rawMsg = parsed.data.message;
  const message = rawMsg.toLowerCase();
  const lang = detectLanguage(rawMsg, parsed.data.language);

  let response: {
    answer: string;
    intent: string;
    source: string;
    location: string;
    highlights: string[];
    advisory?: {
      title: string;
      status: string;
      body: string;
      actions: string[];
    };
  };

  const isAgri =
    message.includes("pesticide") ||
    message.includes("spray") ||
    message.includes("irrigat") ||
    message.includes("farm") ||
    /कीटनाशक|छिड़काव|सिंचाई|फसल|शेती|फवारणी|কীটনাশক|பூச்சிக்கொல்லி|புరుగుమందు|જંતુનાશક|ಕೀಟನಾಶಕ|കീടനാശിനി|ਕੀਟਨਾਸ਼ਕ/.test(
      rawMsg
    );

  const isDisaster =
    message.includes("flood") ||
    message.includes("cyclone") ||
    message.includes("warning") ||
    message.includes("alert") ||
    /बाढ़|चक्रवात|चेतावनी|सतर्कता|বন্যা|ঘূর্ণিঝড়|வெள்ளம்|புயல்|వరద|తుఫాను|પૂર|વાવાઝોડું|ಪ್ರವಾಹ|ಚಂಡಮಾರುತ|പ്രളയം|ചുഴലിക്കാറ്റ്|ਹੜ੍ਹ/.test(
      rawMsg
    );

  const isClimate =
    message.includes("trend") ||
    message.includes("climate") ||
    message.includes("kerala") ||
    /जलवायु|জলবায়ু|காலநிலை|వాతావరణ మార్పు|આબોહવા|ಹವಾಮಾನ ಬದಲಾವಣೆ|കാലാവസ്ഥാ വ്യതിയാനം|ਜਲਵਾਯੂ/.test(
      rawMsg
    );

  const stateMatch = findMatchingIndianState(rawMsg);

  if (stateMatch) {
    let answer = "";
    switch (lang) {
      case "hi":
        answer = `${stateMatch.hindiName} (${stateMatch.capital}, भारत) में वर्तमान तापमान ${stateMatch.temperature}°C है और मौसम '${stateMatch.condition}' बना हुआ है। बारिश की संभावना ${stateMatch.rainChance}% तथा हवा की गति ${stateMatch.windSpeed} किमी/घंटा है। ${stateMatch.alert ? `चेतावनी: ${stateMatch.alert}। ` : ""}${stateMatch.advisory.body}`;
        break;
      case "mr":
        answer = `${stateMatch.name} (${stateMatch.capital}, भारत) मध्ये सध्या तापमान ${stateMatch.temperature}°C असून '${stateMatch.condition}' हवामान आहे। पावसाची शक्यता ${stateMatch.rainChance}% आणि आर्द्रता ${stateMatch.humidity}% आहे। ${stateMatch.advisory.body}`;
        break;
      case "bn":
        answer = `${stateMatch.name} (${stateMatch.capital}, ভারত)-এ বর্তমান তাপমাত্রা ${stateMatch.temperature}°C এবং আবহাওয়া '${stateMatch.condition}'। বৃষ্টির সম্ভাবনা ${stateMatch.rainChance}% এবং আর্দ্রতা ${stateMatch.humidity}%। ${stateMatch.advisory.body}`;
        break;
      case "ta":
        answer = `${stateMatch.name} (${stateMatch.capital}, இந்தியா) பகுதியில் தற்போதைய வெப்பநிலை ${stateMatch.temperature}°C மற்றும் வானிலை '${stateMatch.condition}' ஆக உள்ளது. மழை வாய்ப்பு ${stateMatch.rainChance}%. ${stateMatch.advisory.body}`;
        break;
      case "te":
        answer = `${stateMatch.name} (${stateMatch.capital}, భారతదేశం) లో ప్రస్తుత ఉష్ణోగ్రత ${stateMatch.temperature}°C మరియు వాతావరణం '${stateMatch.condition}' గా ఉంది. వర్షం సంభావ్యత ${stateMatch.rainChance}%. ${stateMatch.advisory.body}`;
        break;
      case "gu":
        answer = `${stateMatch.name} (${stateMatch.capital}, ભારત) માં વર્તમાન તાપમાન ${stateMatch.temperature}°C છે અને હવામાન '${stateMatch.condition}' છે. વરસાદની શક્યતા ${stateMatch.rainChance}% છે. ${stateMatch.advisory.body}`;
        break;
      case "kn":
        answer = `${stateMatch.name} (${stateMatch.capital}, ಭಾರತ) ನಲ್ಲಿ ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${stateMatch.temperature}°C ಮತ್ತು ಹವಾಮಾನ '${stateMatch.condition}' ಆಗಿದೆ. ಮಳೆಯ ಸಂಭವನೀಯತೆ ${stateMatch.rainChance}%. ${stateMatch.advisory.body}`;
        break;
      case "ml":
        answer = `${stateMatch.name} (${stateMatch.capital}, ഇന്ത്യ) ൽ നിലവിലെ താപനില ${stateMatch.temperature}°C ഉം കാലാവസ്ഥ '${stateMatch.condition}' ഉം ആണ്. മഴ സാധ്യത ${stateMatch.rainChance}%. ${stateMatch.advisory.body}`;
        break;
      case "pa":
        answer = `${stateMatch.name} (${stateMatch.capital}, ਭਾਰਤ) ਵਿੱਚ ਮੌਜੂਦਾ ਤਾਪਮਾਨ ${stateMatch.temperature}°C ਹੈ ਅਤੇ ਮੌਸਮ '${stateMatch.condition}' ਹੈ। ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ${stateMatch.rainChance}% ਹੈ। ${stateMatch.advisory.body}`;
        break;
      default:
        answer = `In ${stateMatch.name}, ${stateMatch.country} (Capital: ${stateMatch.capital}), current conditions are ${stateMatch.temperature}°C and ${stateMatch.condition.toLowerCase()}. Rain probability is ${stateMatch.rainChance}% with humidity around ${stateMatch.humidity}% and winds at ${stateMatch.windSpeed} km/h. ${stateMatch.alert ? `Active IMD Alert: ${stateMatch.alert}. ` : ""}${stateMatch.advisory.body}`;
        break;
    }

    response = {
      answer,
      intent: "state-forecast",
      source: `IMD & Open-Meteo · Regional Meteorological Centre (${stateMatch.region} India)`,
      location: `${stateMatch.name}, ${stateMatch.country}`,
      highlights: [
        `${stateMatch.temperature}°C · ${stateMatch.condition}`,
        `${stateMatch.rainChance}% Rain Probability`,
        `AQI: ${stateMatch.aqi}`,
        `Capital: ${stateMatch.capital}`,
      ],
      advisory: stateMatch.advisory,
    };
  } else if (isAgri) {
    switch (lang) {
      case "hi":
        response = {
          answer: "कल कीटनाशक का छिड़काव टालने की सलाह दी जाती है। दोपहर में 78% बारिश और तेज़ हवा की संभावना है, जिससे दवा धुल सकती है।",
          intent: "farmer-advisory",
          source: "कृषि मौसम विशेषज्ञ · मौसम पूर्वानुमान एवं पवन विश्लेषण",
          location: "नई दिल्ली / राष्ट्रीय कृषि क्षेत्र",
          highlights: ["कल 78% बारिश की संभावना", "14 किमी/घंटा हवा की गति", "अनुकूल समय: शनिवार सुबह"],
          advisory: {
            title: "छिड़काव अभी रोकें",
            status: "सावधानी",
            body: "शनिवार की सुबह मौसम साफ रहने पर छिड़काव करें। यदि सिंचाई आवश्यक हो, तो केवल हल्की सिंचाई करें।",
            actions: ["शनिवार का पूर्वानुमान देखें", "सुबह 7 बजे का रिमाइंडर लगाएं", "5-दिवसीय कृषि पूर्वानुमान"],
          },
        };
        break;
      case "mr":
        response = {
          answer: "उद्या कीटकनाशक फवारणी पुढे ढकलण्याचा सल्ला दिला जातो. दुपारच्या वेळी पाऊस आणि वारा वाढण्याची शक्यता आहे, ज्यामुळे औषध वाहून जाऊ शकते.",
          intent: "farmer-advisory",
          source: "कृषी हवामान सल्लागार · वारा व पाऊस विश्लेषण",
          location: "महाराष्ट्र / नवी दिल्ली",
          highlights: ["उद्या ७८% पावसाची शक्यता", "१४ किमी/तास वाऱ्याचा वेग", "योग्य वेळ: शनिवार सकाळ"],
          advisory: {
            title: "फवारणी थांबवा",
            status: "सावधगिरी",
            body: "शनिवारी सकाळी कोरडे हवामान असताना फवारणी करा. पाणी देणे आवश्यक असल्यास हलके पाणी द्या.",
            actions: ["शनिवारचा अंदाज पहा", "सकाळी ७ चा अलार्म लावा", "५ दिवसांचा कृषी सल्ला"],
          },
        };
        break;
      case "bn":
        response = {
          answer: "আগামীকাল কীটনাশক স্প্রে না করার পরামর্শ দেওয়া হচ্ছে। বিকেলে বৃষ্টির সম্ভাবনা ৭৮% এবং দমকা হাওয়া বইতে পারে, যার ফলে ওষুধ ধুয়ে যেতে পারে।",
          intent: "farmer-advisory",
          source: "কৃষি আবহাওয়া পরামর্শ · পূর্বাভাস ও বায়ু বিশ্লেষণ",
          location: "নয়াদিল্লি / বাংলা কৃষি অঞ্চল",
          highlights: ["আগামীকাল ৭৮% বৃষ্টির সম্ভাবনা", "১৪ কিমি/ঘণ্টা বাতাস", "অনুকূল সময়: শনিবার সকাল"],
          advisory: {
            title: "স্প্রে করা স্থগিত রাখুন",
            status: "সতর্কতা",
            body: "শনিবার সকালে আকাশ পরিষ্কার থাকলে স্প্রে করুন। সেচের প্রয়োজন হলে খুব হালকা সেচ দিন।",
            actions: ["শনিবারের পূর্বাভাস দেখুন", "সকাল ৭টায় রিমাইন্ডার সেট করুন", "৫ দিনের কৃষি বুলেটিন"],
          },
        };
        break;
      case "ta":
        response = {
          answer: "நாளை பூச்சிக்கொல்லி மருந்து தெளிப்பதைத் தவிர்க்கவும். மதிய வேளையில் 78% மழை மற்றும் பலத்த காற்று வீசக்கூடும் என்பதால் மருந்து அடித்துச் செல்லப்படலாம்.",
          intent: "farmer-advisory",
          source: "வேளாண் வானிலை ஆலோசகர் · காற்று மற்றும் மழை பகுப்பாய்வு",
          location: "புது தில்லி / தமிழ்நாடு",
          highlights: ["நாளை 78% மழை வாய்ப்பு", "14 கி.மீ/மணி காற்று வேகம்", "சிறந்த நேரம்: சனிக்கிழமை காலை"],
          advisory: {
            title: "மருந்து தெளிப்பதை ஒத்திவைக்கவும்",
            status: "எச்சரிக்கை",
            body: "சனிக்கிழமை காலை தெளிப்பது சிறந்தது. பாசனம் அவசியமென்றால் குறைந்த அளவில் நீர் பாய்ச்சவும்.",
            actions: ["சனிக்கிழமை முன்னறிவிப்பு", "காலை 7:00 மணி நினைவூட்டல்", "5 நாள் வேளாண் தகவல்"],
          },
        };
        break;
      case "te":
        response = {
          answer: "రేపు పురుగుమందు పిచికారీ చేయవద్దు. మధ్యాహ్నం 78% వర్షం మరియు ఈదురు గాలులు వీచే అవకాశం ఉన్నందున మందు కొట్టుకుపోయే ప్రమాదం ఉంది.",
          intent: "farmer-advisory",
          source: "వ్యవసాయ వాతావరణ నిపుణుడు · గాలి మరియు వర్ష విశ్లేషణ",
          location: "న్యూఢిల్లీ / తెలుగు ప్రాంతాలు",
          highlights: ["రేపు 78% వర్షం అవకాశం", "గంటకు 14 కి.మీ వేగంతో గాలి", "అనుకూల సమయం: శనివారం ఉదయం"],
          advisory: {
            title: "పిచికారీని వాయిదా వేయండి",
            status: "హెచ్చరిక",
            body: "శనివారం ఉదయం పొడి వాతావరణంలో పిచికారీ చేయడం ఉత్తమం. నీటిపారుదల అవసరమైతే తక్కువగా అందించండి.",
            actions: ["శనివారం వాతావరణం చూడండి", "ఉదయం 7 గంటలకు రిమైండర్", "5 రోజుల వ్యవసాయ నివేదిక"],
          },
        };
        break;
      case "gu":
        response = {
          answer: "આવતીકાલે જંતુનાશક દવા છાંટવાનું ટાળવાની સલાહ છે. બપોરે ૭૮% વરસાદ અને પવનની શક્યતા છે, જેનાથી દવા ધોવાઈ જઈ શકે છે.",
          intent: "farmer-advisory",
          source: "કૃષિ હવામાન સલાહકાર · પવન અને વરસાદ વિશ્લેષણ",
          location: "નવી દિલ્હી / ગુજરાત",
          highlights: ["કાલે ૭૮% વરસાદની શક્યતા", "૧૪ કિમી/કલાક પવનની ઝડપ", "શ્રેષ્ઠ સમય: શનિવાર સવાર"],
          advisory: {
            title: "છંટકાવ મુલતવી રાખો",
            status: "સાવચેતી",
            body: "શનિવારે સવારે હવામાન સાનુકૂળ હોય ત્યારે છંટકાવ કરો. પિયત આપવું જરૂરી હોય તો હળવું પાણી આપવું.",
            actions: ["શનિવારની આગાહી જુઓ", "સવારે ૭ વાગ્યાનું રિમાઇન્ડર", "૫ દિવસની કૃષિ માર્ગદર્શિકા"],
          },
        };
        break;
      case "kn":
        response = {
          answer: "ನಾಳೆ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸುವುದನ್ನು ಮುಂದೂಡುವುದು ಸೂಕ್ತ. ಮಧ್ಯಾಹ್ನ ಶೇ. 78 ರಷ್ಟು ಮಳೆ ಮತ್ತು ಬಿರುಗಾಳಿ ಬೀಸುವ ಸಾಧ್ಯತೆಯಿದ್ದು, ಔಷಧ ಕೊಚ್ಚಿಹೋಗಬಹುದು.",
          intent: "farmer-advisory",
          source: "ಕೃಷಿ ಹವಾಮಾನ ತಜ್ಞರು · ಗಾಳಿ ಮತ್ತು ಮಳೆ ವಿಶ್ಲೇಷಣೆ",
          location: "ನವದೆಹಲಿ / ಕರ್ನಾಟಕ",
          highlights: ["ನಾಳೆ 78% ಮಳೆ ಸಂಭವನೀಯತೆ", "ಗಂಟೆಗೆ 14 ಕಿ.ಮೀ ಗಾಳಿ", "ಸೂಕ್ತ ಸಮಯ: ಶನಿವಾರ ಬೆಳಿಗ್ಗೆ"],
          advisory: {
            title: "ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ",
            status: "ಎಚ್ಚರಿಕೆ",
            body: "ಶನಿವಾರ ಬೆಳಿಗ್ಗೆ ಒಣ ಹವೆಯಿದ್ದಾಗ ಸಿಂಪಡಿಸಿ. ನೀರಾವರಿ ಅಗತ್ಯವಿದ್ದರೆ ಲಘುವಾಗಿ ನೀರು ಹಾಯಿಸಿ.",
            actions: ["ಶನಿವಾರದ ಮುನ್ಸೂಚನೆ ನೋಡಿ", "ಬೆಳಿಗ್ಗೆ 7 ಗಂಟೆಗೆ ಜ್ಞಾಪನೆ", "5 ದಿನಗಳ ಕೃಷಿ ಸಲಹೆ"],
          },
        };
        break;
      case "ml":
        response = {
          answer: "നാളെ കീടനാശിനി പ്രയോഗം ഒഴിവാക്കുന്നതാണ് നല്ലത്. ഉച്ചയ്ക്ക് ശേഷം 78% മഴയ്ക്കും ശക്തമായ കാറ്റിനും സാധ്യതയുണ്ട്, ഇത് മരുന്ന് ഒലിച്ചുപോകാൻ ഇടയാക്കും.",
          intent: "farmer-advisory",
          source: "കാർഷിക കാലാവസ്ഥാ ഉപദേശകൻ · കാറ്റും മഴയും വിശകലനം",
          location: "ന്യൂഡൽഹി / കേരളം",
          highlights: ["നാളെ 78% മഴ സാധ്യത", "മണിക്കൂറിൽ 14 കി.മീ കാറ്റ്", "അനുയോജ്യമായ സമയം: ശനിയാഴ്ച രാവിലെ"],
          advisory: {
            title: "മരുന്ന് തളിക്കുന്നത് മാറ്റിവെക്കുക",
            status: "ജാഗ്രത",
            body: "ശനിയാഴ്ച രാവിലെ തെളിഞ്ഞ കാലാവസ്ഥയിൽ മരുന്ന് തളിക്കാം. നനയ്ക്കാൻ ആവശ്യമുണ്ടെങ്കിൽ നേരിയ തോതിൽ നനയ്ക്കുക.",
            actions: ["ശനിയാഴ്ചത്തെ പ്രവചനം", "രാവിലെ 7 മണിക്ക് റിമൈൻഡർ", "5 ദിവസത്തെ കാർഷിക വിവരങ്ങൾ"],
          },
        };
        break;
      case "pa":
        response = {
          answer: "ਕੱਲ੍ਹ ਕੀਟਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਟਾਲਣ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ। ਦੁਪਹਿਰ ਵੇਲੇ 78% ਮੀਂਹ ਅਤੇ ਤੇਜ਼ ਹਵਾਵਾਂ ਚੱਲਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ, ਜਿਸ ਨਾਲ ਦਵਾਈ ਧੁਲ ਸਕਦੀ ਹੈ।",
          intent: "farmer-advisory",
          source: "ਖੇਤੀਬਾੜੀ ਮੌਸਮ ਮਾਹਿਰ · ਹਵਾ ਅਤੇ ਮੀਂਹ ਵਿਸ਼ਲੇਸ਼ਣ",
          location: "ਨਵੀਂ ਦਿੱਲੀ / ਪੰਜਾਬ",
          highlights: ["ਕੱਲ੍ਹ 78% ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ", "14 ਕਿਮੀ/ਘੰਟਾ ਹਵਾ ਦੀ ਗਤੀ", "ਵਧੀਆ ਸਮਾਂ: ਸ਼ਨੀਵਾਰ ਸਵੇਰੇ"],
          advisory: {
            title: "ਛਿੜਕਾਅ ਰੋਕੋ",
            status: "ਸਾਵਧਾਨੀ",
            body: "ਸ਼ਨੀਵਾਰ ਸਵੇਰੇ ਸਾਫ਼ ਮੌਸਮ ਵਿੱਚ ਛਿੜਕਾਅ ਕਰੋ। ਜੇਕਰ ਸਿੰਚਾਈ ਜ਼ਰੂਰੀ ਹੈ, ਤਾਂ ਹਲਕਾ ਪਾਣੀ ਲਗਾਓ।",
            actions: ["ਸ਼ਨੀਵਾਰ ਦਾ ਪੂਰਵ-ਅਨੁਮਾਨ ਦੇਖੋ", "ਸਵੇਰੇ 7 ਵਜੇ ਦਾ ਰੀਮਾਈਂਡਰ ਲਗਾਓ", "5 ਦਿਨਾਂ ਖੇਤੀਬਾੜੀ ਸਲਾਹ"],
          },
        };
        break;
      default:
        response = {
          answer:
            "I would hold off on spraying tomorrow. Rain is likely in the afternoon (78% chance) and winds may pick up, which can wash away the application and reduce coverage.",
          intent: "farmer-advisory",
          source: "Agriculture advisory agent · Forecast + wind analysis",
          location: "New Delhi",
          highlights: ["78% rain probability tomorrow", "14 km/h wind today", "Best window: Saturday morning"],
          advisory: {
            title: "Wait to spray",
            status: "Caution",
            body: "Use the dry window on Saturday morning instead. If irrigation is essential, keep it light and early.",
            actions: ["Check the Saturday forecast", "Set a reminder for 7:00 AM", "View 5-day forecast"],
          },
        };
        break;
    }
  } else if (isDisaster) {
    switch (lang) {
      case "hi":
        response = {
          answer: "निचले असम के लिए बाढ़ की चेतावनी और तटीय ओडिशा के लिए चक्रवात परामर्श सक्रिय है। ब्रह्मपुत्र में जलस्तर बढ़ने की आशंका के कारण असम की स्थिति अधिक संवेदनशील है।",
          intent: "disaster-intelligence",
          source: "आपदा चेतावनी एजेंट · IMD अलर्ट नेटवर्क",
          location: "भारत / असम एवं ओडिशा",
          highlights: ["बाढ़ चेतावनी · डिब्रूगढ़, असम", "चक्रवात परामर्श · तटीय ओडिशा", "आधिकारिक बुलेटिन पर नज़र रखें"],
        };
        break;
      case "mr":
        response = {
          answer: "आसामच्या सखल भागासाठी पुराचा इशारा आणि किनारपट्टी ओडिशासाठी चक्रीवादळाचा सल्ला सक्रिय आहे. आसाममध्ये नदीची पातळी वाढण्याची शक्यता अधिक आहे.",
          intent: "disaster-intelligence",
          source: "आपत्ती व्यवस्थापन कक्ष · IMD चेतावणी फीड",
          location: "भारत / आसाम आणि ओडिशा",
          highlights: ["पुराचा इशारा · दिब्रुगड", "चक्रीवादळ सल्ला · ओडिशा किनारपट्टी", "अधिकृत बुलेटिन तपासा"],
        };
        break;
      case "bn":
        response = {
          answer: "নিম্ন আসামের জন্য সক্রিয় বন্যা সতর্কতা এবং উপকূলীয় ওড়িশার জন্য ঘূর্ণিঝড় পরামর্শ জারি রয়েছে। আসামে নদীর জলস্তর দ্রুত বাড়তে পারে।",
          intent: "disaster-intelligence",
          source: "দুর্যোগ সতর্কীকরণ এজেন্ট · IMD বুলেটিন",
          location: "ভারত / আসাম ও ওড়িশা",
          highlights: ["বন্যা সতর্কতা · ডিব্রুগড়", "ঘূর্ণিঝড় পরামর্শ · উপকূলীয় ওড়িশা", "সরকারি নির্দেশিকা মেনে চলুন"],
        };
        break;
      case "ta":
        response = {
          answer: "அசாமின் தாழ்வான பகுதிகளுக்கு வெள்ள அபாய எச்சரிக்கையும், கடலோர ஒடிசாவிற்கு புயல் எச்சரிக்கையும் விடுக்கப்பட்டுள்ளது. கரையோர மக்கள் எச்சரிக்கையுடன் இருக்கவும்.",
          intent: "disaster-intelligence",
          source: "பேரிடர் எச்சரிக்கை பிரிவு · IMD நேரலை எச்சரிக்கைகள்",
          location: "இந்தியா / அசாம் & ஒடிசா",
          highlights: ["வெள்ள அபாயம் · திப்ருகர்", "புயல் எச்சரிக்கை · கடலோர ஒடிசா", "அரசு அறிவிப்புகளைக் கவனிக்கவும்"],
        };
        break;
      case "te":
        response = {
          answer: "దిగువ అస్సాం ప్రాంతాలకు వరద హెచ్చరిక మరియు తీరప్రాంత ఒడిశాకు తుఫాను హెచ్చరిక జారీ చేయబడింది. నదీ పరీవాహక ప్రాంత ప్రజలు అప్రమత్తంగా ఉండాలి.",
          intent: "disaster-intelligence",
          source: "విపత్తు హెచ్చరిక ఏజెంట్ · IMD అధికారిక సమాచారం",
          location: "భారతదేశం / అస్సాం & ఒడిశా",
          highlights: ["వరద హెచ్చరిక · డిబ్రూగఢ్", "తుఫాను సలహా · తీరప్రాంత ఒడిశా", "అధికారిక బులెటిన్లను గమనించండి"],
        };
        break;
      case "gu":
        response = {
          answer: "નીચલા આસામ માટે પૂરની ચેતવણી અને દરિયાકાંઠાના ઓડિશા માટે ચક્રવાતની સલાહ સક્રિય છે. નદીનું જળસ્તર વધવાની સંભાવના છે.",
          intent: "disaster-intelligence",
          source: "આપત્તિ ચેતવણી સેલ · IMD ફીડ",
          location: "ભારત / આસામ અને ઓડિશા",
          highlights: ["પૂર ચેતવણી · ડિબ્રુગઢ", "ચક્રવાત સલાહ · દરિયાકાંઠાનું ઓડિશા", "સત્તાવાર માહિતી અનુસરો"],
        };
        break;
      case "kn":
        response = {
          answer: "ಅಸ್ಸಾಂನ ತಗ್ಗು ಪ್ರದೇಶಗಳಿಗೆ ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಕರಾವಳಿ ಒಡಿಶಾಗೆ ಚಂಡಮಾರುತದ ಮುನ್ನೆಚ್ಚರಿಕೆ ನೀಡಲಾಗಿದೆ. ನದಿ ನೀರಿನ ಮಟ್ಟ ಏರಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.",
          intent: "disaster-intelligence",
          source: "ವಿಪತ್ತು ಎಚ್ಚರಿಕೆ ದಳ · IMD ಸೂಚನೆಗಳು",
          location: "ಭಾರತ / ಅಸ್ಸಾಂ ಮತ್ತು ಒಡಿಶಾ",
          highlights: ["ಪ್ರವಾಹ ಎಚ್ಚರಿಕೆ · ದಿಬ್ರೂಗಢ", "ಚಂಡಮಾರುತದ ಎಚ್ಚರಿಕೆ · ಒಡಿಶಾ ಕರಾವಳಿ", "ಅಧಿಕೃತ ಬುಲೆಟಿನ್ ವೀಕ್ಷಿಸಿ"],
        };
        break;
      case "ml":
        response = {
          answer: "ലോവർ അസമിൽ പ്രളയ മുന്നറിയിപ്പും ഒഡീഷ തീരത്ത് ചുഴലിക്കാറ്റ് ജാഗ്രതാനിർദ്ദേശവും നിലവിലുണ്ട്. അസമിലെ നദികളിൽ ജലനിരപ്പ് ഉയരാൻ സാധ്യതയുണ്ട്.",
          intent: "disaster-intelligence",
          source: "ദുരന്ത നിവാരണ സെൽ · IMD മുന്നറിയിപ്പുകൾ",
          location: "ഇന്ത്യ / അസം & ഒഡീഷ",
          highlights: ["പ്രളയ മുന്നറിയിപ്പ് · ദിബ്രുഗഡ്", "ചുഴലിക്കാറ്റ് ജാഗ്രത · തീരദേശ ഒഡീഷ", "ഔദ്യോഗിക നിർദ്ദേശങ്ങൾ പാലിക്കുക"],
        };
        break;
      case "pa":
        response = {
          answer: "ਅਸਾਮ ਦੇ ਹੇਠਲੇ ਇਲਾਕਿਆਂ ਲਈ ਹੜ੍ਹ ਦੀ ਚੇਤਾਵਨੀ ਅਤੇ ਤੱਟਵਰਤੀ ਓਡੀਸ਼ਾ ਲਈ ਚੱਕਰਵਾਤ ਦੀ ਸਲਾਹ ਜਾਰੀ ਹੈ। ਦਰਿਆਵਾਂ ਦਾ ਪਾਣੀ ਚੜ੍ਹਨ ਦਾ ਖ਼ਤਰਾ ਹੈ।",
          intent: "disaster-intelligence",
          source: "ਆਫ਼ਤ ਚੇਤਾਵਨੀ ਸੈੱਲ · IMD ਬੁਲੇਟਿਨ",
          location: "ਭਾਰਤ / ਅਸਾਮ ਅਤੇ ਓਡੀਸ਼ਾ",
          highlights: ["ਹੜ੍ਹ ਦੀ ਚੇਤਾਵਨੀ · ਡਿਬਰੂਗੜ੍ਹ", "ਚੱਕਰਵਾਤ ਸਲਾਹ · ਤੱਟਵਰਤੀ ਓਡੀਸ਼ਾ", "ਸਰਕਾਰੀ ਹਦਾਇਤਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ"],
        };
        break;
      default:
        response = {
          answer:
            "There is an active flood watch for lower Assam and a cyclone advisory for coastal Odisha. The Assam watch is the most time-sensitive because river levels may rise overnight.",
          intent: "disaster-intelligence",
          source: "Alert agent · IMD-style warning feed",
          location: "India",
          highlights: ["Flood watch · Dibrugarh", "Cyclone advisory · Coastal Odisha", "Monitor official bulletins"],
        };
        break;
    }
  } else if (isClimate) {
    switch (lang) {
      case "hi":
        response = {
          answer: "केरल में 2025 के मानसून में बारिश मौसमी औसत से 8.4% अधिक दर्ज की गई है। जुलाई और अगस्त में सबसे मजबूत उछाल देखा गया, जबकि तापमान 0.6°C अधिक गर्म है।",
          intent: "climate-analysis",
          source: "जलवायु विश्लेषण मॉडल · ऐतिहासिक वर्षा डेटासेट",
          location: "केरल",
          highlights: ["सामान्य से +8.4% अधिक वर्षा", "+0.6°C तापमान विसंगति", "जुलाई सबसे अधिक वर्षा वाला महीना"],
        };
        break;
      case "mr":
        response = {
          answer: "केरळमध्ये २०२५ च्या मान्सून हंगामात सरासरीपेक्षा ८.४% अधिक पाऊस झाला आहे. जुलै आणि ऑगस्ट महिन्यात सर्वाधिक पावसाची नोंद झाली आहे.",
          intent: "climate-analysis",
          source: "हवामान बदल विश्लेषक · ऐतिहासिक डेटा",
          location: "केरळ",
          highlights: ["+८.४% जास्त पाऊस", "+०.६°C तापमान वाढ", "जुलै महिन्यात सर्वाधिक पाऊस"],
        };
        break;
      case "bn":
        response = {
          answer: "কেরালা ২০২৫ বর্ষা মৌসুমে স্বাভাবিকের চেয়ে ৮.৪% বেশি বৃষ্টিপাত রেকর্ড করেছে। জুলাই ও আগস্ট মাসে সর্বোচ্চ বৃষ্টি হয়েছে, তাপমাত্রা ০.৬°C উষ্ণতর ছিল।",
          intent: "climate-analysis",
          source: "জলবায়ু বিশ্লেষণ এজেন্ট · ঐতিহাসিক বৃষ্টিপাত রেকর্ড",
          location: "কেরালা",
          highlights: ["স্বাভাবিকের চেয়ে +৮.৪% বৃষ্টি", "+০.৬°C তাপমাত্রা বৃদ্ধি", "জুলাই ছিল সবচেয়ে আর্দ্র মাস"],
        };
        break;
      case "ta":
        response = {
          answer: "கேரளாவில் 2025 தென்மேற்கு பருவமழை இயல்பை விட 8.4% அதிகமாக பதிவாகியுள்ளது. ஜூலை மற்றும் ஆகஸ்ட் மாதங்களில் அதிக மழை பெய்துள்ளது.",
          intent: "climate-analysis",
          source: "காலநிலை பகுப்பாய்வு பிரிவு · வரலாற்று மழைப்பொழிவு தரவு",
          location: "கேரளா",
          highlights: ["இயல்பை விட +8.4% அதிக மழை", "+0.6°C வெப்பநிலை உயர்வு", "ஜூலை அதிக மழை பெய்த மாதம்"],
        };
        break;
      case "te":
        response = {
          answer: "కేరళలో 2025 రుతుపవనాల వర్షపాతం సాధారణం కంటే 8.4% ఎక్కువగా నమోదైంది. జూలై మరియు ఆగస్టులలో అత్యధిక వర్షపాతం కురిసింది.",
          intent: "climate-analysis",
          source: "వాతావరణ మార్పుల విశ్లేషణ · చారిత్రక వర్షపాత సమాచారం",
          location: "కేరళ",
          highlights: ["సాధారణం కంటే +8.4% వర్షపాతం", "+0.6°C ఉష్ణోగ్రత పెరుగుదల", "జూలై అత్యధిక వర్షపాతం గల నెల"],
        };
        break;
      case "gu":
        response = {
          answer: "કેરળમાં ૨૦૨૫ ના ચોમાસામાં સામાન્ય કરતાં ૮.૪% વધુ વરસાદ નોંધાયો છે. જુલાઈ અને ઓગસ્ટમાં સૌથી વધુ વરસાદ થયો હતો.",
          intent: "climate-analysis",
          source: "આબોહવા વિશ્લેષણ મોડેલ · ઐતિહાસિક ડેટાસેટ",
          location: "કેરળ",
          highlights: ["સામાન્ય કરતાં +૮.૪% વધુ વરસાદ", "+૦.૬°C તાપમાન વધારો", "જુલાઈ સૌથી વધુ વરસાદી મહિનો"],
        };
        break;
      case "kn":
        response = {
          answer: "ಕೇರಳದಲ್ಲಿ 2025 ರ ಮುಂಗಾರು ಮಳೆಯು ವಾಡಿಕೆಗಿಂತ 8.4% ಹೆಚ್ಚಾಗಿದೆ. ಜುಲೈ ಮತ್ತು ಆಗಸ್ಟ್ ತಿಂಗಳಲ್ಲಿ ಗರಿಷ್ಠ ಮಳೆಯಾಗಿದೆ.",
          intent: "climate-analysis",
          source: "ಹವಾಮಾನ ವಿಶ್ಲೇಷಣಾ ವಿಭಾಗ · ಐತಿಹಾಸಿಕ ಮಳೆ ದಾಖಲೆ",
          location: "ಕೇರಳ",
          highlights: ["ವಾಡಿಕೆಗಿಂತ +8.4% ಹೆಚ್ಚು ಮಳೆ", "+0.6°C ತಾಪಮಾನ ವ್ಯತ್ಯಾಸ", "ಜುಲೈ ತಿಂಗಳಲ್ಲಿ ಅತ್ಯಧಿಕ ಮಳೆ"],
        };
        break;
      case "ml":
        response = {
          answer: "കേരളത്തിൽ 2025 മൺസൂൺ കാലത്ത് സാധാരണയേക്കാൾ 8.4% കൂടുതൽ മഴ ലഭിച്ചു. ജൂലൈ, ഓഗസ്റ്റ് മാസങ്ങളിലാണ് ഏറ്റവും ഉയർന്ന മഴ രേഖപ്പെടുത്തിയത്.",
          intent: "climate-analysis",
          source: "കാലാവസ്ഥാ വിശകലന ഏജന്റ് · ചരിത്ര മഴക്കണക്കുകൾ",
          location: "കേരളം",
          highlights: ["സാധാരണയേക്കാൾ +8.4% മഴ", "+0.6°C താപനില വ്യതിയാനം", "ജൂലൈ ഏറ്റവും കൂടുതൽ മഴ ലഭിച്ച മാസം"],
        };
        break;
      case "pa":
        response = {
          answer: "ਕੇਰਲ ਵਿੱਚ 2025 ਦੇ ਮਾਨਸੂਨ ਦੌਰਾਨ ਆਮ ਨਾਲੋਂ 8.4% ਵੱਧ ਮੀਂਹ ਪਿਆ ਹੈ। ਜੁਲਾਈ ਅਤੇ ਅਗਸਤ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਧ ਵਰਖਾ ਦਰਜ ਕੀਤੀ ਗਈ ਸੀ।",
          intent: "climate-analysis",
          source: "ਜਲਵਾਯੂ ਵਿਸ਼ਲੇਸ਼ਣ ਮਾਡਲ · ਇਤਿਹਾਸਕ ਵਰਖਾ ਰਿਕਾਰਡ",
          location: "ਕੇਰਲ",
          highlights: ["ਆਮ ਨਾਲੋਂ +8.4% ਵੱਧ ਮੀਂਹ", "+0.6°C ਤਾਪਮਾਨ ਵਾਧਾ", "ਜੁਲਾਈ ਸਭ ਤੋਂ ਵੱਧ ਮੀਂਹ ਵਾਲਾ ਮਹੀਨਾ"],
        };
        break;
      default:
        response = {
          answer:
            "Kerala's 2025 monsoon rainfall is running 8.4% above the seasonal baseline in this view. July and August contributed the strongest positive anomaly, while temperatures are about 0.6°C warmer than the reference period.",
          intent: "climate-analysis",
          source: "Climate agent · Historical rainfall dataset",
          location: "Kerala",
          highlights: ["+8.4% rainfall vs baseline", "+0.6°C temperature anomaly", "July was the wettest month"],
        };
        break;
    }
  } else {
    switch (lang) {
      case "hi":
        response = {
          answer: "हाँ, कल नई दिल्ली में बारिश की 78% संभावना है। दोपहर के समय लगभग 14 मिमी वर्षा हो सकती है। तापमान 25° से 31°C के बीच रहेगा। छाता साथ रखें।",
          intent: "forecast",
          source: "मौसम पूर्वानुमान एजेंट · Open-Meteo",
          location: "नई दिल्ली",
          highlights: ["78% बारिश की संभावना", "14 मिमी अनुमानित वर्षा", "कल 25–31°C तापमान"],
        };
        break;
      case "mr":
        response = {
          answer: "होय, उद्या नवी दिल्लीत पावसाची शक्यता ७८% असून सुमारे १४ मिमी पाऊस पडू शकतो. तापमान २५° ते ३१°C दरम्यान राहील. बाहेर पडताना छत्री सोबत ठेवा.",
          intent: "forecast",
          source: "हवामान अंदाज एजंट · Open-Meteo",
          location: "नवी दिल्ली",
          highlights: ["७८% पावसाची शक्यता", "१४ मिमी अंदाजे पाऊस", "तापमान २५–३१°C"],
        };
        break;
      case "bn":
        response = {
          answer: "হ্যাঁ, আগামীকাল নতুন দিল্লিতে বৃষ্টির সম্ভাবনা ৭৮% এবং প্রায় ১৪ মিমি বৃষ্টি হতে পারে। তাপমাত্রা ২৫° থেকে ৩১°C এর মধ্যে থাকবে। ছাতা সঙ্গে রাখুন।",
          intent: "forecast",
          source: "আবহাওয়া পূর্বাভাস এজেন্ট · Open-Meteo",
          location: "নয়াদিল্লি",
          highlights: ["৭৮% বৃষ্টির সম্ভাবনা", "১৪ মিমি সম্ভাব্য বৃষ্টিপাত", "২৫–৩১°C তাপমাত্রা"],
        };
        break;
      case "ta":
        response = {
          answer: "ஆம், நாளை புது தில்லியில் 78% மழை பெய்ய வாய்ப்புள்ளது, சுமார் 14 மிமீ மழை பதிவாகலாம். வெப்பநிலை 25° முதல் 31°C வரை இருக்கும். குடை எடுத்துச் செல்லவும்.",
          intent: "forecast",
          source: "வானிலை முன்னறிவிப்பு முகவர் · Open-Meteo",
          location: "புது தில்லி",
          highlights: ["78% மழை வாய்ப்பு", "14 மிமீ எதிர்பார்க்கப்படும் மழை", "நாளை 25–31°C"],
        };
        break;
      case "te":
        response = {
          answer: "అవును, రేపు న్యూఢిల్లీలో 78% వర్షం కురిసే అవకాశం ఉంది, సుమారు 14 మి.మీ వర్షపాతం నమోదవుతుంది. ఉష్ణోగ్రత 25° నుండి 31°C వరకు ఉంటుంది. గొడుగు వెంట ఉంచుకోండి.",
          intent: "forecast",
          source: "వాతావરણ అంచనా ఏజెంట్ · Open-Meteo",
          location: "న్యూఢిల్లీ",
          highlights: ["78% వర్షం అవకాశం", "14 మి.మీ ఆశించిన వర్షపాతం", "రేపు 25–31°C ఉష్ణోగ్రత"],
        };
        break;
      case "gu":
        response = {
          answer: "હા, આવતીકાલે નવી દિલ્હીમાં ૭૮% વરસાદની શક્યતા છે અને આશરે ૧૪ મીમી વરસાદ પડી શકે છે. તાપમાન ૨૫° થી ૩૧°C વચ્ચે રહેશે. બહાર નીકળતી વખતે છત્રી સાથે રાખો.",
          intent: "forecast",
          source: "હવામાન આગાહી એજન્ટ · Open-Meteo",
          location: "નવી દિલ્હી",
          highlights: ["૭૮% વરસાદની શક્યતા", "૧૪ મીમી વરસાદની આગાહી", "આવતીકાલે ૨૫–૩૧°C"],
        };
        break;
      case "kn":
        response = {
          answer: "ಹೌದು, ನಾಳೆ ನವದೆಹಲಿಯಲ್ಲಿ ಶೇ. 78 ರಷ್ಟು ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ ಮತ್ತು ಸುಮಾರು 14 ಮಿ.ಮೀ ಮಳೆಯಾಗಬಹುದು. ತಾಪಮಾನ 25° ನಿಂದ 31°C ಇರಲಿದೆ. ಛತ್ರಿ ತೆಗೆದುಕೊಂಡು ಹೋಗಿ.",
          intent: "forecast",
          source: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಏಜೆಂಟ್ · Open-Meteo",
          location: "ನವದೆಹಲಿ",
          highlights: ["78% ಮಳೆ ಸಂಭವನೀಯತೆ", "14 ಮಿ.ಮೀ ನಿರೀಕ್ಷಿತ ಮಳೆ", "ನಾಳೆ 25–31°C"],
        };
        break;
      case "ml":
        response = {
          answer: "അതെ, നാളെ ന്യൂഡൽഹിയിൽ 78% മഴയ്ക്ക് സാധ്യതയുണ്ട്, ഏകദേശം 14 മില്ലിമീറ്റർ മഴ ലഭിച്ചേക്കാം. താപനില 25° മുതൽ 31°C വരെ ആയിരിക്കും. കുട കരുതുക.",
          intent: "forecast",
          source: "കാലാവസ്ഥാ പ്രവചന ഏജന്റ് · Open-Meteo",
          location: "ന്യൂഡൽഹി",
          highlights: ["78% മഴ സാധ്യത", "14 മില്ലിമീറ്റർ പ്രതീക്ഷിക്കുന്ന മഴ", "നാളെ 25–31°C"],
        };
        break;
      case "pa":
        response = {
          answer: "ਹਾਂ, ਕੱਲ੍ਹ ਨਵੀਂ ਦਿੱਲੀ ਵਿੱਚ 78% ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ ਅਤੇ ਲਗਭਗ 14 ਮਿਲੀਮੀਟਰ ਵਰਖਾ ਹੋ ਸਕਦੀ ਹੈ। ਤਾਪਮਾਨ 25° ਤੋਂ 31°C ਦਰਮਿਆਨ ਰਹੇਗਾ। ਛਤਰੀ ਨਾਲ ਰੱਖੋ।",
          intent: "forecast",
          source: "ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ ਏਜੰਟ · Open-Meteo",
          location: "ਨਵੀਂ ਦਿੱਲੀ",
          highlights: ["78% ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ", "14 ਮਿਲੀਮੀਟਰ ਸੰਭਾਵੀ ਵਰਖਾ", "ਕੱਲ੍ਹ 25–31°C"],
        };
        break;
      default:
        response = {
          answer:
            "Tomorrow in New Delhi looks wetter than today. There is a 78% chance of rain, with around 14 mm expected, mainly through the afternoon. Keep outdoor plans flexible.",
          intent: "forecast",
          source: "Weather agent · Open-Meteo forecast",
          location: "New Delhi",
          highlights: ["78% rain probability", "14 mm expected rainfall", "25–31°C tomorrow"],
        };
        break;
    }
  }

  res.json(AskWeatherAssistantResponse.parse(response));
});

export default router;