import { addDays, subDays, subMonths } from 'date-fns';

export const mockChildren = [
  {
    id: '1',
    name: 'Emma',
    birthDate: '2022-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1602030028438-4cf153cbae66?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Noah',
    birthDate: '2023-03-20',
    avatarUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=300&auto=format&fit=crop',
  },
];

export const mockMemories = [
  {
    id: '1',
    childId: '1',
    type: 'photo',
    title: 'First Steps!',
    content: 'Emma took her first steps today! She was so excited and proud of herself.',
    mediaUrl: 'https://images.unsplash.com/photo-1588815154768-e9fab0a8a900?q=80&w=800&auto=format&fit=crop',
    mood: 'Excited',
    createdAt: subDays(new Date(), 2).toISOString(),
  },
  {
    id: '2',
    childId: '1',
    type: 'photo',
    title: 'Park Adventures',
    content: 'A beautiful day at the park. Emma loved the swings!',
    mediaUrl: 'https://images.unsplash.com/photo-1597248374161-426f0d6d2fc9?q=80&w=800&auto=format&fit=crop',
    mood: 'Happy',
    createdAt: subDays(new Date(), 5).toISOString(),
  },
  {
    id: '3',
    childId: '1',
    type: 'photo',
    title: 'Beach Day',
    content: 'First time at the beach! Emma was fascinated by the waves.',
    mediaUrl: 'https://images.unsplash.com/photo-1602537693516-bb0ac0a4616a?q=80&w=800&auto=format&fit=crop',
    mood: 'Excited',
    createdAt: subDays(new Date(), 10).toISOString(),
  },
];

export const mockHealthRecords = [
  {
    id: '1',
    childId: '1',
    type: 'checkup',
    date: subMonths(new Date(), 1).toISOString(),
    title: 'Regular Checkup',
    notes: 'All measurements within normal range',
    height: 75.5,
    weight: 9.2,
  },
  {
    id: '2',
    childId: '1',
    type: 'vaccination',
    date: subMonths(new Date(), 2).toISOString(),
    title: 'MMR Vaccine',
    notes: 'First dose completed',
  },
];

export const mockMedications = [
  {
    id: '1',
    childId: '1',
    name: 'Vitamin D Drops',
    dosage: '400 IU',
    frequency: 'Daily',
    startDate: subMonths(new Date(), 3).toISOString(),
    notes: 'Give with morning feeding',
  },
];

export const mockStories = [
  {
    id: '1',
    childId: '1',
    title: 'Emma\'s Space Adventure',
    content: 'Once upon a time, there was a brave little girl named Emma who dreamed of exploring the stars...',
    theme: 'space',
    characters: ['Emma', 'Star Cat', 'Moon Bunny'],
    illustrations: [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    childId: '1',
    title: 'The Magical Garden',
    content: 'In a garden full of wonder, Emma discovered tiny fairy houses among the flowers...',
    theme: 'fantasy',
    characters: ['Emma', 'Garden Fairy', 'Wise Owl'],
    illustrations: [
      'https://images.unsplash.com/photo-1581985673473-0784a7a44e39?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export const mockTimeCapsules = [
  {
    id: '1',
    childId: '1',
    type: 'text',
    title: 'Letter for Your 18th Birthday',
    content: 'Dear Emma, As I write this, you are just learning to walk...',
    mediaUrl: 'https://images.unsplash.com/photo-1606791422814-b32c705e3e2f?q=80&w=800&auto=format&fit=crop',
    unlockDate: addDays(new Date(), 365).toISOString(),
  },
  {
    id: '2',
    childId: '1',
    type: 'photo',
    title: 'Your First Year Album',
    content: 'A collection of precious moments from your first year of life.',
    mediaUrl: 'https://images.unsplash.com/photo-1596973706786-c88b3ee54c23?q=80&w=800&auto=format&fit=crop',
    unlockDate: addDays(new Date(), 730).toISOString(),
  },
];

export const mockUpcomingEvents = [
  {
    id: '1',
    childId: '1',
    title: 'Doctor\'s Appointment',
    date: addDays(new Date(), 1).toISOString(),
    type: 'medical',
  },
  {
    id: '2',
    childId: '1',
    title: '12-Month Vaccinations',
    date: addDays(new Date(), 7).toISOString(),
    type: 'vaccination',
  },
];

export const mockParentingTips = [
  {
    id: '1',
    ageRange: '0-6 months',
    tips: [
      {
        title: 'Sleep Schedule',
        content: 'Newborns sleep 16-17 hours a day. Establish a bedtime routine early.',
        icon: 'moon',
      },
      {
        title: 'Feeding',
        content: 'Feed every 2-3 hours. Watch for hunger cues like rooting and sucking motions.',
        icon: 'nutrition',
      },
      {
        title: 'Development',
        content: 'Tummy time helps strengthen neck muscles. Start with short sessions.',
        icon: 'fitness',
      },
    ],
  },
  {
    id: '2',
    ageRange: '6-12 months',
    tips: [
      {
        title: 'Solid Foods',
        content: 'Start with single-ingredient purees. Watch for allergic reactions.',
        icon: 'restaurant',
      },
      {
        title: 'Motor Skills',
        content: 'Encourage crawling and pulling up to stand with safe furniture.',
        icon: 'body',
      },
      {
        title: 'Social Development',
        content: 'Play peek-a-boo and other interactive games to build social skills.',
        icon: 'people',
      },
    ],
  },
  {
    id: '3',
    ageRange: '1-2 years',
    tips: [
      {
        title: 'Language',
        content: 'Read books daily and name objects to build vocabulary.',
        icon: 'book',
      },
      {
        title: 'Independence',
        content: 'Let them try feeding themselves and encourage exploration.',
        icon: 'star',
      },
      {
        title: 'Safety',
        content: 'Childproof your home as they become more mobile.',
        icon: 'shield',
      },
    ],
  },
];

export const mockGrowthMilestones = [
  {
    id: '1',
    ageRange: '0-6 months',
    milestones: [
      'Lifts head during tummy time',
      'Smiles at people',
      'Begins to babble',
      'Brings hands to mouth',
    ],
  },
  {
    id: '2',
    ageRange: '6-12 months',
    milestones: [
      'Crawls forward on belly',
      'Sits without assistance',
      'Responds to own name',
      'Picks up small objects',
    ],
  },
  {
    id: '3',
    ageRange: '1-2 years',
    milestones: [
      'Walks alone',
      'Says several single words',
      'Points to show others',
      'Follows simple directions',
    ],
  },
];