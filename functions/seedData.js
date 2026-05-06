const siteConfig = {
  id: "site",
  name: "CareBridge",
  site_name: "CareBridge",
  new_logo: "/brand/carebridge-logo-future.png",
  favicon: "/brand/carebridge-favicon-future.png",
  slogan_title: "Smart clinic appointments with a human touch",
  slogan_text:
    "Find trusted specialists, choose the right time, and manage appointments with a calm, connected care experience.",
  address: "22 Wellness Avenue, New Delhi, India",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
  postal_code: "110001",
  email: "care@carebridge.example",
  contact_email: "care@carebridge.example",
  phone: "+91 98765 43210",
  contact: "+91 98765 43210",
  currency: "USD",
  currency_symbol: "$",
  opening_time: "09:00",
  closing_time: "19:00",
  facebook: "https://www.facebook.com",
  instagram: "https://www.instagram.com",
  twitter: "https://www.twitter.com",
  linkedin: "https://www.linkedin.com",
  status: 1,
};

const locations = [
  {id: "loc-delhi", name: "New Delhi", status: 1},
  {id: "loc-noida", name: "Noida", status: 1},
  {id: "loc-gurugram", name: "Gurugram", status: 1},
];

const departments = [
  {id: "dep-cardiology", name: "Cardiology", status: 1},
  {id: "dep-dermatology", name: "Dermatology", status: 1},
  {id: "dep-neurology", name: "Neurology", status: 1},
  {id: "dep-pediatrics", name: "Pediatrics", status: 1},
  {id: "dep-orthopedics", name: "Orthopedics", status: 1},
  {id: "dep-general", name: "General Medicine", status: 1},
];

const staff = [
  {
    id: "doctor-amelia-shah",
    fname: "Amelia",
    lname: "Shah",
    name: "Dr. Amelia Shah",
    username: "amelia.shah",
    email: "amelia.shah@doctorsconsultation.example",
    role: "Doctor",
    designation: "Senior Cardiologist",
    department: "Cardiology",
    location: "New Delhi",
    yoe: 14,
    amount: 65,
    status: 1,
    average_rating: 4.8,
    rating: 4.8,
    image: "/brand/doctor-avatar-female-teal.png",
    introduction:
      "Dr. Amelia Shah focuses on preventive cardiology, hypertension management, and long-term heart health planning.",
    achievements:
      "<p>Fellowship in non-invasive cardiology. Published research on lifestyle-led cardiac recovery.</p>",
  },
  {
    id: "doctor-rahul-mehta",
    fname: "Rahul",
    lname: "Mehta",
    name: "Dr. Rahul Mehta",
    username: "rahul.mehta",
    email: "rahul.mehta@doctorsconsultation.example",
    role: "Doctor",
    designation: "Consultant Dermatologist",
    department: "Dermatology",
    location: "Noida",
    yoe: 9,
    amount: 45,
    status: 1,
    average_rating: 4.6,
    rating: 4.6,
    image: "/brand/doctor-avatar-teal.png",
    introduction:
      "Dr. Rahul Mehta treats acne, pigmentation, hair loss, and chronic skin allergies with evidence-based plans.",
    achievements:
      "<p>Member of the Indian Association of Dermatologists. Advanced dermoscopy certification.</p>",
  },
  {
    id: "doctor-nisha-rao",
    fname: "Nisha",
    lname: "Rao",
    name: "Dr. Nisha Rao",
    username: "nisha.rao",
    email: "nisha.rao@doctorsconsultation.example",
    role: "Doctor",
    designation: "Neurology Specialist",
    department: "Neurology",
    location: "Gurugram",
    yoe: 12,
    amount: 70,
    status: 1,
    average_rating: 4.9,
    rating: 4.9,
    image: "/brand/doctor-avatar-female-teal.png",
    introduction:
      "Dr. Nisha Rao helps patients with migraines, seizures, neuropathy, and memory concerns.",
    achievements:
      "<p>Lead clinician for headache care pathways and patient education programs.</p>",
  },
  {
    id: "doctor-vikram-kapoor",
    fname: "Vikram",
    lname: "Kapoor",
    name: "Dr. Vikram Kapoor",
    username: "vikram.kapoor",
    email: "vikram.kapoor@doctorsconsultation.example",
    role: "Doctor",
    designation: "Orthopedic Surgeon",
    department: "Orthopedics",
    location: "New Delhi",
    yoe: 16,
    amount: 75,
    status: 1,
    average_rating: 4.7,
    rating: 4.7,
    image: "/brand/doctor-avatar-teal.png",
    introduction:
      "Dr. Vikram Kapoor works with sports injuries, joint pain, fractures, and post-operative rehabilitation.",
    achievements:
      "<p>Special training in minimally invasive joint procedures and sports rehabilitation.</p>",
  },
  {
    id: "doctor-priya-menon",
    fname: "Priya",
    lname: "Menon",
    name: "Dr. Priya Menon",
    username: "priya.menon",
    email: "priya.menon@doctorsconsultation.example",
    role: "Doctor",
    designation: "Pediatrician",
    department: "Pediatrics",
    location: "Noida",
    yoe: 11,
    amount: 50,
    status: 1,
    average_rating: 4.8,
    rating: 4.8,
    image: "/brand/doctor-avatar-female-teal.png",
    introduction:
      "Dr. Priya Menon supports newborn care, vaccination planning, nutrition, and childhood illness management.",
    achievements:
      "<p>Certified in pediatric emergency care and family health counseling.</p>",
  },
  {
    id: "doctor-arjun-sen",
    fname: "Arjun",
    lname: "Sen",
    name: "Dr. Arjun Sen",
    username: "arjun.sen",
    email: "arjun.sen@doctorsconsultation.example",
    role: "Doctor",
    designation: "Family Physician",
    department: "General Medicine",
    location: "Gurugram",
    yoe: 8,
    amount: 40,
    status: 1,
    average_rating: 4.5,
    rating: 4.5,
    image: "/brand/doctor-avatar-teal.png",
    introduction:
      "Dr. Arjun Sen provides primary care, chronic illness follow-up, preventive screening, and travel health advice.",
    achievements:
      "<p>Runs community health camps and preventive screening clinics.</p>",
  },
];

const services = [
  {
    id: "svc-cardiology",
    name: "Cardiology",
    text: "Heart health consultations, ECG review, blood pressure care, and preventive cardiac plans.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-dermatology",
    name: "Dermatology",
    text: "Skin, hair, allergy, acne, and pigmentation treatment with practical follow-up plans.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-neurology",
    name: "Neurology",
    text: "Specialist support for migraine, nerve pain, seizures, dizziness, and memory concerns.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-pediatrics",
    name: "Pediatrics",
    text: "Child health, growth monitoring, vaccinations, nutrition, and urgent pediatric advice.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-orthopedics",
    name: "Orthopedics",
    text: "Joint pain, sports injuries, fracture recovery, posture issues, and mobility care.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
  {
    id: "svc-general-medicine",
    name: "General Medicine",
    text: "Primary care for fever, infections, chronic conditions, health checks, and referrals.",
    image: "/brand/service-icon-teal.png",
    status: 1,
  },
];

const blogCategories = [
  {id: "blogcat-wellness", name: "Wellness", status: 1},
  {id: "blogcat-prevention", name: "Prevention", status: 1},
  {id: "blogcat-family-care", name: "Family Care", status: 1},
];

const blogs = [
  {
    id: "blog-heart-checkup",
    name: "When should you schedule a heart check-up?",
    author: "Care Team",
    date: "2026-05-01",
    category: "Prevention",
    image: "/brand/blog-heart-care-teal.png",
    text:
      "<p>Regular heart screening helps catch risk factors early, especially if you have high blood pressure, diabetes, chest discomfort, or a family history of heart disease.</p>",
    status: 1,
  },
  {
    id: "blog-skin-care",
    name: "Simple skin habits dermatologists recommend",
    author: "Dr. Rahul Mehta",
    date: "2026-04-22",
    category: "Wellness",
    image: "/brand/blog-skin-care-teal.png",
    text:
      "<p>Consistent sunscreen, gentle cleansing, and early treatment for recurring irritation can prevent many common skin problems from becoming chronic.</p>",
    status: 1,
  },
  {
    id: "blog-child-fever",
    name: "What to watch when a child has fever",
    author: "Dr. Priya Menon",
    date: "2026-04-10",
    category: "Family Care",
    image: "/brand/blog-family-care-teal.png",
    text:
      "<p>Hydration, temperature patterns, breathing comfort, alertness, and age are important clues. Seek urgent care when symptoms feel unusual or severe.</p>",
    status: 1,
  },
];

const patients = [
  {
    id: "patient-demo",
    username: "demo.patient",
    name: "Demo Patient",
    age: "26-35",
    gender: "Female",
    contact: "9876543210",
    email: "patient@example.com",
    city: "New Delhi",
    image: "/brand/patient-avatar-teal.png",
    status: 1,
  },
];

const feedback = [
  {
    id: "feedback-1",
    doctor: "doctor-amelia-shah",
    patient: patients[0],
    rating: 5,
    review: "Clear advice, easy booking, and a calm consultation.",
    is_active: true,
    status: 1,
  },
  {
    id: "feedback-2",
    doctor: "doctor-rahul-mehta",
    patient: patients[0],
    rating: 4.5,
    review: "The treatment plan was simple and explained well.",
    is_active: true,
    status: 1,
  },
];

const appointments = [
  {
    id: "appt-demo-1",
    name: "Demo Patient",
    username: "demo.patient",
    doctor: "Dr. Amelia Shah",
    doctor_username: "amelia.shah",
    location: "New Delhi",
    department: "Cardiology",
    date: "2026-05-08",
    time: "10:00 - 10:30",
    status: "confirmed",
    payment_status: 1,
    amount: 65,
  },
];

const holidays = [
  {
    id: "holiday-1",
    username: "amelia.shah",
    date: "2026-05-15",
    comment: "Doctor unavailable",
    status: 1,
  },
];

const pad = (value) => String(value).padStart(2, "0");

const makeSubSlots = (date, slotId, startHour) => {
  const base = [
    [0, 30],
    [30, 60],
  ];

  return base.map(([startMinute, endMinute], index) => {
    const isBooked =
      new Date(`${date}T00:00:00`).getDate() % 5 === 0 && index === 0;
    return {
      id: `${slotId}-sub-${index + 1}`,
      start_time: `${pad(startHour)}:${pad(startMinute)}:00`,
      end_time:
        endMinute === 60
          ? `${pad(startHour + 1)}:00:00`
          : `${pad(startHour)}:${pad(endMinute)}:00`,
      is_active: true,
      is_booked: isBooked,
    };
  });
};

const buildMonthlySlots = (year, month) => {
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const daysInMonth = new Date(numericYear, numericMonth, 0).getDate();
  const slotsByDate = {};

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${numericYear}-${pad(numericMonth)}-${pad(day)}`;
    const dateObj = new Date(`${date}T00:00:00`);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) {
      continue;
    }

    const slotOneId = `${date}-morning`;
    const slotTwoId = `${date}-afternoon`;
    const slots = [
      {
        id: slotOneId,
        slot_number: 1,
        start_time: "10:00:00",
        end_time: "11:00:00",
        duration: 30,
        is_active: true,
        sub_slots: makeSubSlots(date, slotOneId, 10),
      },
      {
        id: slotTwoId,
        slot_number: 2,
        start_time: "15:00:00",
        end_time: "16:00:00",
        duration: 30,
        is_active: true,
        sub_slots: makeSubSlots(date, slotTwoId, 15),
      },
    ];
    const allSubSlots = slots.flatMap((slot) => slot.sub_slots);
    const booked = allSubSlots.filter((slot) => slot.is_booked).length;

    slotsByDate[date] = {
      id: date,
      date,
      total_count: allSubSlots.length,
      total_booked: booked,
      slots: slots.map((slot) => ({
        ...slot,
        booked_sub_slot_count: slot.sub_slots.filter((subSlot) => subSlot.is_booked).length,
      })),
    };
  }

  return slotsByDate;
};

const seedCollections = {
  config: [siteConfig],
  services,
  blogs,
  staff,
  locations,
  departments,
  blogCategories,
  patients,
  feedback,
  appointments,
  holidays,
};

module.exports = {
  siteConfig,
  services,
  blogs,
  staff,
  locations,
  departments,
  blogCategories,
  patients,
  feedback,
  appointments,
  holidays,
  seedCollections,
  buildMonthlySlots,
};
