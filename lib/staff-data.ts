export type StaticStaffMember = {
  id: string;
  name: string;
  badge_number: string;
  rank: string;
  role: string;
  division: string;
  avatar_url: null;
};

export const STAFF_DATA: StaticStaffMember[] = [
  {
    id: "s1",
    name: "Michael M.",
    badge_number: "3001",
    rank: "Sheriff",
    role: "Chief Executive & Law Enforcement Authority",
    division: "Office of the Sheriff",
    avatar_url: null,
  },
  {
    id: "s2",
    name: "Noah S.",
    badge_number: "3002",
    rank: "Undersheriff",
    role: "Second in Command",
    division: "Office of the Sheriff",
    avatar_url: null,
  },
  {
    id: "s3",
    name: "Dilynn E.",
    badge_number: "3003",
    rank: "Chief Deputy",
    role: "Operations Commander",
    division: "Field Operations",
    avatar_url: null,
  },
  {
    id: "s4",
    name: "Austin B.",
    badge_number: "3004",
    rank: "Colonel",
    role: "Senior Field Commander",
    division: "Field Operations",
    avatar_url: null,
  },
];
