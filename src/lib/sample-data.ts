import type { Role } from "@/lib/permissions";

export const branches = [
  {
    id: "san-nicolas-new",
    name: "TroniCase San Nicolas New",
    address: "Brgy. 11, McArthur Highway, San Nicolas"
  },
  {
    id: "main",
    name: "TroniCase Main",
    address: "Brgy. 3, San Nicolas, Ilocos Norte"
  },
  {
    id: "baccara",
    name: "TroniCase Baccara",
    address: "Morillo St., Brgy. 5, San Simon, Baccara"
  },
  {
    id: "vintar",
    name: "TroniCase Vintar",
    address: "Brgy. 5, San Ramon, Vintar, Ilocos Norte"
  },
  {
    id: "badoc",
    name: "TroniCase Badoc",
    address: "Brgy. 2, Badoc, Ilocos Norte"
  },
  {
    id: "gadget-specialist",
    name: "Gadget Specialist",
    address: "Robinsons Ilocos Norte"
  },
  {
    id: "cellboy-fix",
    name: "Cellboy Fix",
    address: "Second Level Cyberzone, SM Laoag City"
  }
];

export const users: Array<{ id: string; name: string; email: string; role: Role; branchId?: string }> = [
  { id: "u-super", name: "Mara Reyes", email: "super@tronicase.test", role: "SUPER_ADMIN" },
  { id: "u-admin", name: "Nico Flores", email: "admin@tronicase.test", role: "ADMIN" },
  { id: "u-manager", name: "Ivy Dela Cruz", email: "manager@tronicase.test", role: "BRANCH_MANAGER", branchId: "main" },
  { id: "u-cashier", name: "Lea Santos", email: "cashier@tronicase.test", role: "CASHIER", branchId: "san-nicolas-new" },
  { id: "u-tech", name: "Paolo Ramos", email: "tech@tronicase.test", role: "TECHNICIAN", branchId: "main" },
  { id: "u-dev", name: "Dev Console", email: "dev@tronicase.test", role: "DEVELOPER" }
];

export const products = [
  {
    id: "p-iphone-battery",
    name: "iPhone 11 Battery",
    sku: "TC-IP11-BAT",
    barcode: "480001100001",
    category: "Battery",
    brand: "Apple",
    compatibility: "iPhone 11",
    costPrice: 890,
    sellingPrice: 1690,
    stock: 14,
    lowStock: 5
  },
  {
    id: "p-typec-cable",
    name: "Braided Type-C Cable 1m",
    sku: "TC-CBL-TC-1M",
    barcode: "480001100002",
    category: "Accessories",
    brand: "TroniCase",
    compatibility: "USB-C devices",
    costPrice: 95,
    sellingPrice: 249,
    stock: 42,
    lowStock: 10
  },
  {
    id: "p-samsung-lcd",
    name: "Galaxy A52 LCD Assembly",
    sku: "TC-A52-LCD",
    barcode: "480001100003",
    category: "Screen",
    brand: "Samsung",
    compatibility: "Galaxy A52",
    costPrice: 2100,
    sellingPrice: 3890,
    stock: 4,
    lowStock: 5
  },
  {
    id: "p-tempered",
    name: "9D Tempered Glass",
    sku: "TC-9D-GLASS",
    barcode: "480001100004",
    category: "Protection",
    brand: "Universal",
    compatibility: "Assorted phones",
    costPrice: 35,
    sellingPrice: 150,
    stock: 86,
    lowStock: 20
  }
];

export const repairTickets = [
  {
    id: "r-1001",
    customer: "Jessa Agbayani",
    device: "iPhone 11",
    problem: "Fast battery drain and random shutdown",
    status: "In Progress",
    technician: "Paolo Ramos",
    branch: "TroniCase Main",
    laborFee: 700,
    partsTotal: 1690,
    warrantyUntil: "2026-08-17"
  },
  {
    id: "r-1002",
    customer: "Mark Baluyot",
    device: "Galaxy A52",
    problem: "Cracked display",
    status: "Waiting Parts",
    technician: "Paolo Ramos",
    branch: "TroniCase San Nicolas New",
    laborFee: 900,
    partsTotal: 3890,
    warrantyUntil: "2026-08-21"
  },
  {
    id: "r-1003",
    customer: "Ana Fariñas",
    device: "Oppo Reno 8",
    problem: "Charging port intermittent",
    status: "Completed",
    technician: "Paolo Ramos",
    branch: "TroniCase Baccara",
    laborFee: 600,
    partsTotal: 450,
    warrantyUntil: "2026-07-30"
  }
];

export const salesTrend = [
  { label: "Mon", pos: 18500, repairs: 6200 },
  { label: "Tue", pos: 22400, repairs: 8800 },
  { label: "Wed", pos: 19800, repairs: 7300 },
  { label: "Thu", pos: 25600, repairs: 9400 },
  { label: "Fri", pos: 31400, repairs: 12800 },
  { label: "Sat", pos: 36200, repairs: 15100 },
  { label: "Sun", pos: 16800, repairs: 5400 }
];

export const monthlySales = [
  { label: "Jan", sales: 712000 },
  { label: "Feb", sales: 688000 },
  { label: "Mar", sales: 743000 },
  { label: "Apr", sales: 798000 },
  { label: "May", sales: 834000 }
];

export const expenses = [
  { id: "e-1", category: "Rent", branch: "TroniCase Main", amount: 18000, recordedBy: "Lea Santos", date: "2026-05-15" },
  { id: "e-2", category: "Utilities", branch: "TroniCase San Nicolas New", amount: 7300, recordedBy: "Lea Santos", date: "2026-05-16" },
  { id: "e-3", category: "Supplies", branch: "Gadget Specialist", amount: 2450, recordedBy: "Ivy Dela Cruz", date: "2026-05-16" }
];

export const notifications = [
  { id: "n-1", type: "Low Stock", title: "Galaxy A52 LCD Assembly below threshold", branch: "TroniCase Main", unread: true },
  { id: "n-2", type: "New Repair", title: "Ticket R-1004 created for iPad charging issue", branch: "Cellboy Fix", unread: true },
  { id: "n-3", type: "Completed Repair", title: "Oppo Reno 8 repair ready for release", branch: "TroniCase Baccara", unread: false },
  { id: "n-4", type: "Subscription", title: "System subscription renews in 12 days", branch: "All branches", unread: false }
];
