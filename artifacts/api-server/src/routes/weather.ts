import { Router, type IRouter } from "express";
import {
  AskWeatherAssistantBody,
  AskWeatherAssistantResponse,
  GetClimateTrendsResponse,
  GetWeatherAlertsResponse,
  GetWeatherOverviewResponse,
} from "@workspace/api-zod";

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

router.post("/weather/chat", (req, res) => {
  const parsed = AskWeatherAssistantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please enter a weather question." });
    return;
  }

  const message = parsed.data.message.toLowerCase();
  const isHindi = /बारिश|कल|तापमान|मौसम/.test(parsed.data.message);
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

  if (message.includes("pesticide") || message.includes("spray") || message.includes("irrigat")) {
    response = {
      answer:
        "I would hold off on spraying tomorrow. Rain is likely in the afternoon and winds may pick up, which can wash away the application and reduce coverage.",
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
  } else if (message.includes("flood") || message.includes("cyclone") || message.includes("warning") || message.includes("alert")) {
    response = {
      answer:
        "There is an active flood watch for lower Assam and a cyclone advisory for coastal Odisha. The Assam watch is the most time-sensitive because river levels may rise overnight.",
      intent: "disaster-intelligence",
      source: "Alert agent · IMD-style warning feed",
      location: "India",
      highlights: ["Flood watch · Dibrugarh", "Cyclone advisory · Coastal Odisha", "Monitor official bulletins"],
    };
  } else if (message.includes("trend") || message.includes("rainfall") || message.includes("climate") || message.includes("kerala")) {
    response = {
      answer:
        "Kerala's 2025 monsoon rainfall is running 8.4% above the seasonal baseline in this view. July and August contributed the strongest positive anomaly, while temperatures are about 0.6°C warmer than the reference period.",
      intent: "climate-analysis",
      source: "Climate agent · Historical rainfall dataset",
      location: "Kerala",
      highlights: ["+8.4% rainfall vs baseline", "+0.6°C temperature anomaly", "July was the wettest month"],
    };
  } else if (isHindi) {
    response = {
      answer: "हाँ, कल बारिश की संभावना है। नई दिल्ली में बारिश की संभावना 78% है और लगभग 14 मिमी वर्षा हो सकती है। बाहर जाते समय छाता रखें।",
      intent: "forecast",
      source: "Weather agent · Forecast data",
      location: "नई दिल्ली",
      highlights: ["78% बारिश की संभावना", "लगभग 14 मिमी वर्षा", "तापमान 25° से 31°C"],
    };
  } else {
    response = {
      answer:
        "Tomorrow in New Delhi looks wetter than today. There is a 78% chance of rain, with around 14 mm expected, mainly through the afternoon. Keep outdoor plans flexible.",
      intent: "forecast",
      source: "Weather agent · Open-Meteo forecast",
      location: "New Delhi",
      highlights: ["78% rain probability", "14 mm expected rainfall", "25–31°C tomorrow"],
    };
  }

  res.json(AskWeatherAssistantResponse.parse(response));
});

export default router;