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
    {
      [key: string]: PlanetData;
      "13": {
        name: "ayanamsa";
        value: number;
      };
      debug: {
        observation_point: string;
        ayanamsha: string;
      };
    },
    PlanetMap
  ];
}
