
import { StaffRole } from './types';

export const SERVER_NAME = "SymphonyNetwork";

export const STAFF_ROLES: StaffRole[] = [
  {
    id: 'helper',
    name: 'Helper',
    description: 'Providing essential support to players, answering community questions, and maintaining general chat decorum.',
    requirements: ['Minimum age 16', 'Active community presence', 'Comprehensive knowledge of server rules'],
    permissions: ['/kick', '/warn', '/mute', 'Chat Priority'],
    color: 'bg-indigo-500'
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Enforcing server policies, handling advanced player reports, and managing conflict resolution.',
    requirements: ['Minimum 1 month as Helper', 'Exceptional problem-solving skills', 'Proven reliability'],
    permissions: ['/ban', '/tempban', '/unmute', '/inventorysee', 'Social Logs'],
    color: 'bg-violet-500'
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Overseeing staff operations, managing technical infrastructure, and curating community events.',
    requirements: ['Internal promotion only', 'Senior-level technical expertise', 'High trust clearance'],
    permissions: ['Full Root Access', 'Plugin Config', 'Staff Management'],
    color: 'bg-rose-500'
  },
  {
    id: 'builder',
    name: 'Architect',
    description: 'Designing and constructing high-fidelity server environments, spawns, and seasonal event maps.',
    requirements: ['Advanced WorldEdit proficiency', 'Strong design portfolio', 'Collaboration skills'],
    permissions: ['Creative Mode', 'Schematic Access', 'Voxelsniper'],
    color: 'bg-amber-500'
  }
];
