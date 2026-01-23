import { Subject } from "@/types";

/**
 * Mock subject data for testing and development
 */
export const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS301",
    name: "Data Structures and Algorithms",
    department: "Computer Science",
    description: "Comprehensive study of fundamental data structures including arrays, linked lists, trees, and graphs, along with algorithm design and analysis techniques.",
    createdAt: "2024-09-01T10:00:00Z"
  },
  {
    id: 2,
    code: "BUS205",
    name: "Financial Accounting",
    department: "Business",
    description: "Introduction to financial accounting principles, including the preparation and analysis of financial statements, accounting cycles, and reporting standards.",
    createdAt: "2024-09-01T11:00:00Z"
  },
  {
    id: 3,
    code: "EE410",
    name: "Digital Signal Processing",
    department: "Engineering",
    description: "Advanced concepts in digital signal processing, covering discrete-time systems, Fourier transforms, filter design, and real-world applications.",
    createdAt: "2024-09-01T12:00:00Z"
  }
];
