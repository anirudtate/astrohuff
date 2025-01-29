export interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  speed: number;
  isRetro: boolean;
  sign: string;
  signLord: string;
  house: number;
  nakshatra: string;
  nakshatraLord: string;
  nakshatraPada: number;
}

export interface House {
  number: number;
  sign: string;
  signLord: string;
  degree: number;
}

interface PlanetData {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

interface PlanetMap {
  [key: string]: {
    current_sign: number;
    fullDegree: number;
    normDegree: number;
    isRetro: string;
  };
}

interface AyanamsaData {
  name: "ayanamsa";
  value: number;
}

interface DebugData {
  observation_point: string;
  ayanamsha: string;
}

type FirstOutputItem = Record<string, PlanetData> & {
  debug: DebugData;
};

export interface BirthChartResponse {
  statusCode: number;
  input: {
    year: number;
    month: number;
    date: number;
    hours: number;
    minutes: number;
    seconds: number;
    latitude: number;
    longitude: number;
    timezone: number;
    settings: {
      observation_point: string;
      ayanamsha: string;
    };
  };
  output: [
    Omit<FirstOutputItem, "13" | "debug"> & {
      "13": AyanamsaData;
      debug: DebugData;
    },
    PlanetMap
  ];
}
