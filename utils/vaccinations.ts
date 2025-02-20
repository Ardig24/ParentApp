import { differenceInMonths, addMonths, isBefore } from 'date-fns';

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  recommendedAges: number[]; // in months
  doses: number;
  disease: string;
}

// Based on CDC recommended vaccination schedule
// Source: https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html
export const RECOMMENDED_VACCINES: Vaccine[] = [
  {
    id: 'hepb',
    name: 'Hepatitis B',
    description: 'Protects against hepatitis B virus infection',
    recommendedAges: [0, 1, 6],
    doses: 3,
    disease: 'Hepatitis B',
  },
  {
    id: 'dtap',
    name: 'DTaP',
    description: 'Protects against diphtheria, tetanus, and pertussis',
    recommendedAges: [2, 4, 6, 15, 48],
    doses: 5,
    disease: 'Diphtheria, Tetanus, Pertussis',
  },
  {
    id: 'hib',
    name: 'Hib',
    description: 'Protects against Haemophilus influenzae type b',
    recommendedAges: [2, 4, 6, 12],
    doses: 4,
    disease: 'Haemophilus influenzae type b',
  },
  {
    id: 'ipv',
    name: 'IPV',
    description: 'Protects against polio',
    recommendedAges: [2, 4, 6, 48],
    doses: 4,
    disease: 'Polio',
  },
  {
    id: 'pcv13',
    name: 'PCV13',
    description: 'Protects against pneumococcal disease',
    recommendedAges: [2, 4, 6, 12],
    doses: 4,
    disease: 'Pneumococcal Disease',
  },
  {
    id: 'rv',
    name: 'RV',
    description: 'Protects against rotavirus',
    recommendedAges: [2, 4, 6],
    doses: 3,
    disease: 'Rotavirus',
  },
  {
    id: 'mmr',
    name: 'MMR',
    description: 'Protects against measles, mumps, and rubella',
    recommendedAges: [12, 48],
    doses: 2,
    disease: 'Measles, Mumps, Rubella',
  },
  {
    id: 'var',
    name: 'Varicella',
    description: 'Protects against chickenpox',
    recommendedAges: [12, 48],
    doses: 2,
    disease: 'Chickenpox',
  },
];

export interface VaccineSchedule {
  vaccine: Vaccine;
  doseNumber: number;
  dueDate: Date;
  status: 'due' | 'overdue' | 'upcoming';
}

export function getVaccinationSchedule(
  birthDate: string,
  completedVaccinations: { vaccineId: string; doseNumber: number; date: string }[]
): VaccineSchedule[] {
  const schedule: VaccineSchedule[] = [];
  const today = new Date();
  const birth = new Date(birthDate);
  const ageInMonths = differenceInMonths(today, birth);

  RECOMMENDED_VACCINES.forEach((vaccine) => {
    const completedDoses = completedVaccinations
      .filter((v) => v.vaccineId === vaccine.id)
      .map((v) => v.doseNumber);

    vaccine.recommendedAges.forEach((age, index) => {
      const doseNumber = index + 1;
      if (!completedDoses.includes(doseNumber)) {
        const dueDate = addMonths(birth, age);
        let status: 'due' | 'overdue' | 'upcoming';

        if (isBefore(dueDate, today)) {
          status = 'overdue';
        } else if (
          differenceInMonths(dueDate, today) <= 1 &&
          ageInMonths >= age - 1
        ) {
          status = 'due';
        } else {
          status = 'upcoming';
        }

        schedule.push({
          vaccine,
          doseNumber,
          dueDate,
          status,
        });
      }
    });
  });

  return schedule.sort((a, b) => {
    // Sort by status (overdue first, then due, then upcoming)
    const statusOrder = { overdue: 0, due: 1, upcoming: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Then sort by due date
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
}
