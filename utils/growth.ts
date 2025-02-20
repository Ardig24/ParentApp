import { differenceInMonths } from 'date-fns';

// WHO Child Growth Standards
// Source: https://www.who.int/tools/child-growth-standards

interface GrowthStandards {
  [key: number]: number[];
}

interface GenderStandards {
  height: GrowthStandards;
  weight: GrowthStandards;
}

interface WHOStandards {
  male: GenderStandards;
  female: GenderStandards;
}

const WHO_STANDARDS: WHOStandards = {
  male: {
    height: {
      // [age in months]: [3rd, 15th, 50th, 85th, 97th percentile]
      0: [46.3, 48.0, 49.9, 51.8, 53.4],
      3: [57.2, 59.0, 61.4, 63.9, 65.7],
      6: [63.3, 65.2, 67.6, 70.1, 72.0],
      9: [67.7, 69.7, 72.3, 74.9, 76.9],
      12: [71.3, 73.4, 76.1, 78.9, 81.0],
      18: [77.2, 79.5, 82.4, 85.4, 87.7],
      24: [81.9, 84.3, 87.4, 90.6, 93.0],
      36: [89.4, 92.1, 95.6, 99.1, 101.8],
      48: [95.9, 98.8, 102.7, 106.6, 109.5],
      60: [101.7, 104.9, 109.1, 113.3, 116.5],
    },
    weight: {
      0: [2.5, 2.9, 3.3, 3.7, 4.1],
      3: [5.0, 5.6, 6.4, 7.2, 7.8],
      6: [6.4, 7.1, 7.9, 8.8, 9.5],
      9: [7.4, 8.1, 9.0, 10.0, 10.7],
      12: [8.1, 8.9, 9.9, 11.0, 11.8],
      18: [9.3, 10.2, 11.3, 12.5, 13.4],
      24: [10.2, 11.2, 12.4, 13.7, 14.7],
      36: [11.8, 13.0, 14.4, 15.9, 17.1],
      48: [13.4, 14.8, 16.4, 18.2, 19.6],
      60: [15.0, 16.6, 18.4, 20.4, 22.0],
    },
  },
  female: {
    height: {
      0: [45.6, 47.2, 49.1, 51.0, 52.7],
      3: [55.9, 57.7, 59.8, 61.9, 63.7],
      6: [61.8, 63.7, 65.9, 68.1, 70.0],
      9: [66.1, 68.1, 70.4, 72.7, 74.7],
      12: [69.8, 71.8, 74.3, 76.8, 78.9],
      18: [75.7, 78.0, 80.7, 83.4, 85.7],
      24: [80.7, 83.2, 86.0, 88.8, 91.3],
      36: [88.3, 91.0, 94.2, 97.4, 100.1],
      48: [94.9, 97.9, 101.4, 104.9, 107.9],
      60: [101.1, 104.3, 108.1, 111.9, 115.1],
    },
    weight: {
      0: [2.4, 2.8, 3.2, 3.6, 4.0],
      3: [4.7, 5.3, 6.0, 6.7, 7.3],
      6: [6.0, 6.7, 7.4, 8.2, 8.9],
      9: [6.9, 7.7, 8.5, 9.4, 10.2],
      12: [7.6, 8.4, 9.3, 10.3, 11.1],
      18: [8.8, 9.7, 10.8, 12.0, 12.9],
      24: [9.8, 10.8, 12.0, 13.3, 14.3],
      36: [11.5, 12.7, 14.1, 15.6, 16.8],
      48: [13.1, 14.5, 16.1, 17.9, 19.3],
      60: [14.7, 16.3, 18.2, 20.2, 21.8],
    },
  },
};

export function calculateGrowthPercentile(
  value: number,
  age: number,
  type: 'height' | 'weight',
  gender: 'male' | 'female'
): number {
  const standards = WHO_STANDARDS[gender]?.[type] || {};
  const percentiles = standards[age] || [];
  if (!percentiles.length) return 50;

  // Find the closest age bracket
  const ageMonths = Math.round(age);
  const ageKeys = Object.keys(standards).map(Number);
  const closestAge = ageKeys.reduce((prev, curr) =>
    Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev
  );

  // Get the percentiles for this age
  const closestPercentiles = standards[closestAge];
  
  // Find where the value falls in the percentiles
  if (value <= closestPercentiles[0]) return 3;
  if (value >= closestPercentiles[4]) return 97;

  for (let i = 0; i < closestPercentiles.length - 1; i++) {
    if (value >= closestPercentiles[i] && value <= closestPercentiles[i + 1]) {
      const lowerPercentile = [3, 15, 50, 85, 97][i];
      const upperPercentile = [3, 15, 50, 85, 97][i + 1];
      const lowerValue = closestPercentiles[i];
      const upperValue = closestPercentiles[i + 1];
      
      // Linear interpolation
      return (
        lowerPercentile +
        ((value - lowerValue) * (upperPercentile - lowerPercentile)) /
          (upperValue - lowerValue)
      );
    }
  }

  return 50; // Default to 50th percentile if something goes wrong
}

export function getGrowthStatus(percentile: number): {
  status: 'low' | 'normal' | 'high';
  color: string;
} {
  if (percentile < 15) {
    return { status: 'low', color: '#ef4444' }; // Red
  } else if (percentile > 85) {
    return { status: 'high', color: '#f59e0b' }; // Yellow
  } else {
    return { status: 'normal', color: '#10b981' }; // Green
  }
}

export function calculateBMI(weight: number, height: number): number {
  // height in cm, weight in kg
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getAgeInMonths(birthDate: string): number {
  return differenceInMonths(new Date(), new Date(birthDate));
}
