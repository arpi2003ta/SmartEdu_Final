import mongoose from "mongoose";
import { Course } from "./models/course.model.js";
import { Lecture } from "./models/lecture.model.js";
import { User } from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

// Free sample video URLs (public domain / open educational)
const SAMPLE_VIDEOS = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
];

const getVideo = (i) => SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length];

// Thumbnail placeholder images (Unsplash, no auth needed)
const THUMBNAILS = {
    Physics:
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop",
    Chemistry:
        "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop",
    Mathematics:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop",
    "Mock Test":
        "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop",
    "PYQ Discussion":
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    Biology:
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop",
};

const coursesData = [
    // ─── PHYSICS (5 courses) ──────────────────────────────────────────
    {
        courseTitle: "Physics for JEE: Mechanics & Laws of Motion",
        subTitle: "Complete JEE-level Mechanics — Newton's Laws, Work-Energy, Rotational Dynamics",
        description:
            "Master the foundation of JEE Physics with in-depth coverage of Newton's Laws, friction, circular motion, work-energy theorem, center of mass, and rotational dynamics. Includes 200+ solved problems and JEE-pattern MCQs.",
        category: "Physics",
        courseLevel: "Advance",
        coursePrice: 1499,
        lectures: [
            { title: "Introduction to Kinematics & Motion in 1D", preview: true },
            { title: "Laws of Motion – Newton's 1st, 2nd & 3rd", preview: false },
            { title: "Friction – Static, Kinetic & Rolling", preview: false },
            { title: "Circular Motion & Centripetal Force", preview: false },
            { title: "Work, Energy & Power", preview: false },
            { title: "Center of Mass & Momentum Conservation", preview: false },
            { title: "Rotational Dynamics – Torque & MOI", preview: false },
        ],
    },
    {
        courseTitle: "Physics for JEE: Electrostatics & Current Electricity",
        subTitle: "Coulomb's Law, Capacitors, Kirchhoff's Laws — JEE Advanced level",
        description:
            "Thorough coverage of electrostatics (Coulomb's law, electric field, potential, capacitors) and current electricity (Ohm's law, Kirchhoff's laws, Wheatstone bridge, RC circuits). Hundreds of numerical and conceptual problems.",
        category: "Physics",
        courseLevel: "Advance",
        coursePrice: 1499,
        lectures: [
            { title: "Electric Charges & Coulomb's Law", preview: true },
            { title: "Electric Field & Field Lines", preview: false },
            { title: "Electric Potential & Potential Energy", preview: false },
            { title: "Capacitors & Dielectrics", preview: false },
            { title: "Current, Resistance & Ohm's Law", preview: false },
            { title: "Kirchhoff's Laws & Circuit Analysis", preview: false },
            { title: "Wheatstone Bridge & RC Circuits", preview: false },
        ],
    },
    {
        courseTitle: "Physics for NEET: Waves, Optics & Modern Physics",
        subTitle: "Sound waves, Ray & Wave Optics, Photoelectric Effect — NEET focused",
        description:
            "NEET-focused deep dive into waves (SHM, sound), ray optics (mirrors, lenses, refraction), wave optics (interference, diffraction), and modern physics (photoelectric effect, atomic models, nuclear physics). Fully aligned with NTA NEET syllabus.",
        category: "Physics",
        courseLevel: "Medium",
        coursePrice: 1299,
        lectures: [
            { title: "Simple Harmonic Motion & Damping", preview: true },
            { title: "Sound Waves, Beats & Doppler Effect", preview: false },
            { title: "Ray Optics – Mirrors & Lenses", preview: false },
            { title: "Refraction, Total Internal Reflection & Prism", preview: false },
            { title: "Wave Optics – Interference & Diffraction", preview: false },
            { title: "Photoelectric Effect & Dual Nature of Light", preview: false },
            { title: "Atomic Models & Nuclear Physics Basics", preview: false },
        ],
    },
    {
        courseTitle: "Physics Crash Course for JEE Mains",
        subTitle: "Cover the entire JEE Mains Physics syllabus in 30 days",
        description:
            "A high-speed, high-impact revision course covering all chapters of JEE Mains Physics. Ideal for students in the last 1–2 months before the exam. Focuses on frequently asked question types, shortcuts, and formula sheets.",
        category: "Physics",
        courseLevel: "Medium",
        coursePrice: 799,
        lectures: [
            { title: "Units, Dimensions & Significant Figures", preview: true },
            { title: "Mechanics Quick Revision", preview: false },
            { title: "Thermodynamics & Kinetic Theory", preview: false },
            { title: "Electrostatics & Magnetism Quick Revision", preview: false },
            { title: "Optics & Modern Physics Quick Revision", preview: false },
            { title: "Semiconductor Devices & Communication", preview: false },
        ],
    },
    {
        courseTitle: "Physics Numericals Master Class — JEE Advanced",
        subTitle: "1000+ solved numericals for JEE Advanced Physics",
        description:
            "This course is purely focused on problem-solving. Work through 1000+ meticulously solved numericals spanning all JEE Advanced Physics topics. Covers single-answer, multi-answer, integer type, and paragraph-based questions.",
        category: "Physics",
        courseLevel: "Advance",
        coursePrice: 1999,
        lectures: [
            { title: "Mechanics Numericals – Level 1 & 2", preview: true },
            { title: "Thermodynamics Numericals", preview: false },
            { title: "Electrostatics Numericals", preview: false },
            { title: "Magnetism & EMI Numericals", preview: false },
            { title: "Optics Numericals", preview: false },
            { title: "Modern Physics Numericals", preview: false },
            { title: "Full-Syllabus Mixed Practice Problems", preview: false },
        ],
    },

    // ─── CHEMISTRY (5 courses) ───────────────────────────────────────
    {
        courseTitle: "Chemistry for JEE: Physical Chemistry Complete",
        subTitle: "Atomic Structure, Thermodynamics, Equilibrium, Electrochemistry — JEE level",
        description:
            "Complete Physical Chemistry course for JEE aspirants. Covers atomic structure, chemical bonding, states of matter, thermodynamics, chemical equilibrium, ionic equilibrium, redox reactions, and electrochemistry with solved JEE problems.",
        category: "Chemistry",
        courseLevel: "Advance",
        coursePrice: 1499,
        lectures: [
            { title: "Atomic Structure & Quantum Numbers", preview: true },
            { title: "Chemical Bonding (VSEPR, MOT, Hybridization)", preview: false },
            { title: "States of Matter – Gases & Liquids", preview: false },
            { title: "Thermodynamics & Hess's Law", preview: false },
            { title: "Chemical Equilibrium & Le Chatelier Principle", preview: false },
            { title: "Ionic Equilibrium – pH, Buffer, Solubility", preview: false },
            { title: "Electrochemistry & Galvanic Cells", preview: false },
        ],
    },
    {
        courseTitle: "Chemistry for NEET: Organic Chemistry Foundation",
        subTitle: "GOC, Hydrocarbons, Functional Groups — from basics to advanced",
        description:
            "Build a solid foundation in Organic Chemistry for NEET. Covers General Organic Chemistry (GOC), reaction mechanisms (SN1, SN2, E1, E2), hydrocarbons, alcohols, aldehydes, ketones, carboxylic acids, amines, and biomolecules.",
        category: "Chemistry",
        courseLevel: "Medium",
        coursePrice: 1299,
        lectures: [
            { title: "General Organic Chemistry – Inductive, Resonance Effects", preview: true },
            { title: "Hydrocarbons – Alkanes, Alkenes, Alkynes", preview: false },
            { title: "Alcohols, Phenols & Ethers", preview: false },
            { title: "Aldehydes & Ketones – Reactions & Mechanisms", preview: false },
            { title: "Carboxylic Acids & Derivatives", preview: false },
            { title: "Amines & Diazonium Salts", preview: false },
            { title: "Biomolecules – Carbohydrates, Proteins, Nucleic Acids", preview: false },
        ],
    },
    {
        courseTitle: "Chemistry for JEE: Inorganic Chemistry Mastery",
        subTitle: "p-block, d-block, Coordination Compounds — complete JEE Inorganic coverage",
        description:
            "Systematic and thorough treatment of JEE Inorganic Chemistry. Covers the periodic table trends, s-block, p-block, d-block elements, coordination compounds, metallurgy, qualitative analysis, and environmental chemistry.",
        category: "Chemistry",
        courseLevel: "Advance",
        coursePrice: 1499,
        lectures: [
            { title: "Periodic Table & Periodic Trends", preview: true },
            { title: "s-block Elements – Alkali & Alkaline Earth Metals", preview: false },
            { title: "p-block Elements (Groups 13–18)", preview: false },
            { title: "d & f Block Elements & Transition Metal Chemistry", preview: false },
            { title: "Coordination Compounds & Isomerism", preview: false },
            { title: "Metallurgy & Qualitative Analysis", preview: false },
            { title: "Environmental Chemistry & Practical Chemistry", preview: false },
        ],
    },
    {
        courseTitle: "Chemistry Crash Course for NEET",
        subTitle: "Revise entire NEET Chemistry syllabus in 25 days",
        description:
            "A focused rapid-revision course for NEET Chemistry. Covers all high-weightage topics from Physical, Organic, and Inorganic Chemistry. Includes chapter-wise formula sheets, mnemonics for reactions, and last-minute tips.",
        category: "Chemistry",
        courseLevel: "Medium",
        coursePrice: 799,
        lectures: [
            { title: "Physical Chemistry – Key Concepts Rapid Revision", preview: true },
            { title: "Organic Chemistry Reaction Summary", preview: false },
            { title: "Inorganic Chemistry – Important Facts & Trends", preview: false },
            { title: "High-Weightage Topic Deep Dives", preview: false },
            { title: "NEET Chemistry Previous Year Analysis", preview: false },
        ],
    },
    {
        courseTitle: "Organic Chemistry Reaction Mechanisms — JEE Advanced",
        subTitle: "Master every named reaction and mechanism for JEE Advanced",
        description:
            "Deep dive into all named reactions and their mechanisms relevant for JEE Advanced — Aldol, Cannizzaro, Clemmensen, Wolff-Kishner, Diels-Alder, Gabriel Synthesis, and 50+ more. Step-by-step electron-pushing mechanism explanations.",
        category: "Chemistry",
        courseLevel: "Advance",
        coursePrice: 1799,
        lectures: [
            { title: "Nucleophilic & Electrophilic Substitution Mechanisms", preview: true },
            { title: "Addition Reactions – Markovnikov & Anti-Markovnikov", preview: false },
            { title: "Elimination Reactions E1 & E2", preview: false },
            { title: "Named Reactions – Aldol, Cannizzaro, Clemmensen", preview: false },
            { title: "Named Reactions – Diels-Alder, Gabriel, Reimer-Tiemann", preview: false },
            { title: "Stereochemistry – Chirality, R/S, Optical Activity", preview: false },
            { title: "Mixed Organic Problems – JEE Advanced Pattern", preview: false },
        ],
    },

    // ─── MATHEMATICS (4 courses) ─────────────────────────────────────
    {
        courseTitle: "Mathematics for JEE: Calculus Complete",
        subTitle: "Limits, Differentiation, Integration, Differential Equations — JEE Advanced level",
        description:
            "Comprehensive JEE Calculus course covering limits, continuity, differentiation (including implicit, parametric), applications (maxima/minima, tangents), indefinite & definite integration, area under curves, and differential equations.",
        category: "Mathematics",
        courseLevel: "Advance",
        coursePrice: 1499,
        lectures: [
            { title: "Limits, Continuity & L'Hôpital's Rule", preview: true },
            { title: "Differentiation – Rules & Implicit Differentiation", preview: false },
            { title: "Applications of Derivatives – Maxima, Minima, Tangents", preview: false },
            { title: "Integration Techniques – Parts, Partial Fractions", preview: false },
            { title: "Definite Integration & Properties", preview: false },
            { title: "Area Under Curves", preview: false },
            { title: "Differential Equations – Variable Separable, Linear", preview: false },
        ],
    },
    {
        courseTitle: "Mathematics for JEE: Algebra & Coordinate Geometry",
        subTitle: "Quadratics, Progressions, Permutations, Straight Lines, Conics — JEE level",
        description:
            "Covers all JEE Algebra and Coordinate Geometry. Topics include complex numbers, quadratic equations, sequences, permutations & combinations, binomial theorem, matrices, determinants, straight lines, circles, parabola, ellipse, and hyperbola.",
        category: "Mathematics",
        courseLevel: "Advance",
        coursePrice: 1499,
        lectures: [
            { title: "Complex Numbers & Quadratic Equations", preview: true },
            { title: "Sequences, Progressions & Series", preview: false },
            { title: "Permutations, Combinations & Probability", preview: false },
            { title: "Binomial Theorem & Mathematical Induction", preview: false },
            { title: "Matrices & Determinants", preview: false },
            { title: "Coordinate Geometry – Straight Lines & Circles", preview: false },
            { title: "Conic Sections – Parabola, Ellipse & Hyperbola", preview: false },
        ],
    },
    {
        courseTitle: "Maths Crash Course for JEE Mains",
        subTitle: "Cover the complete JEE Mains Maths syllabus in 30 days",
        description:
            "High-speed revision of entire JEE Mains Mathematics syllabus. Perfect for the last month before your exam. Focuses on formula recall, pattern recognition, and timed practice drills for maximum marks in minimum time.",
        category: "Mathematics",
        courseLevel: "Medium",
        coursePrice: 799,
        lectures: [
            { title: "Sets, Relations & Functions – Quick Revision", preview: true },
            { title: "Algebra Crash – Complex Numbers to Binomial", preview: false },
            { title: "Trigonometry & Heights and Distances", preview: false },
            { title: "Coordinate Geometry Rapid Revision", preview: false },
            { title: "Calculus Crash – Differentiability to Integration", preview: false },
            { title: "Statistics, Probability & Mathematical Reasoning", preview: false },
        ],
    },
    {
        courseTitle: "Trigonometry & Vectors for JEE",
        subTitle: "Trigonometric identities, inverse trig, 3D vectors — deeply explained",
        description:
            "Focused course on Trigonometry and Vector Algebra, two high-scoring areas of JEE. Covers trigonometric ratios, identities, inverse trigonometric functions, properties of triangles, vectors in 2D/3D, dot & cross products, and 3D geometry.",
        category: "Mathematics",
        courseLevel: "Medium",
        coursePrice: 999,
        lectures: [
            { title: "Trigonometric Ratios & Basic Identities", preview: true },
            { title: "Compound & Multiple Angle Formulae", preview: false },
            { title: "Inverse Trigonometric Functions", preview: false },
            { title: "Properties of Triangles – Sine & Cosine Rule", preview: false },
            { title: "Vectors – Dot Product & Cross Product", preview: false },
            { title: "3D Geometry – Lines & Planes", preview: false },
        ],
    },

    // ─── MOCK TESTS (3 courses) ────────────────────────────────────────
    {
        courseTitle: "JEE Mains Full Mock Test Series (30 Tests)",
        subTitle: "30 full-length JEE Mains mock tests with detailed solutions and analysis",
        description:
            "Practice under real exam conditions with 30 full-length JEE Mains pattern mock tests (Physics + Chemistry + Maths, 3 hours each). Detailed video solutions for every question, AI-driven performance analytics, and subject-wise weak area tracking.",
        category: "Mock Test",
        courseLevel: "Advance",
        coursePrice: 2499,
        lectures: [
            { title: "Mock Test Strategy & Time Management Guide", preview: true },
            { title: "Mock Test 1 – Full Paper + Video Solutions", preview: false },
            { title: "Mock Test 5 – Full Paper + Video Solutions", preview: false },
            { title: "Mock Test 10 – Full Paper + Video Solutions", preview: false },
            { title: "Mid-Series Performance Analysis Workshop", preview: false },
            { title: "Mock Test 20 – Full Paper + Video Solutions", preview: false },
            { title: "Mock Test 30 – Full Paper + Video Solutions", preview: false },
        ],
    },
    {
        courseTitle: "NEET Full Mock Test Series (25 Tests)",
        subTitle: "25 NEET-pattern mock tests covering Physics, Chemistry & Biology",
        description:
            "Simulate real NEET exam conditions with 25 full-length mock tests (180 questions, 3 hours). Covers NCERT-based questions from Physics, Chemistry, and Biology. Includes negative marking practice, answer key analysis, and performance dashboard.",
        category: "Mock Test",
        courseLevel: "Advance",
        coursePrice: 2299,
        lectures: [
            { title: "NEET Exam Pattern, Marking Scheme & Strategy", preview: true },
            { title: "Mock Test 1 – Full Paper + Solutions", preview: false },
            { title: "Mock Test 5 – Full Paper + Solutions", preview: false },
            { title: "Mock Test 10 – Performance Checkpoint", preview: false },
            { title: "Biology Mock – Pure Biology Focus Test", preview: false },
            { title: "Mock Test 20 – Full Paper + Solutions", preview: false },
            { title: "Final Mock Test 25 + Grand Review Session", preview: false },
        ],
    },
    {
        courseTitle: "JEE Advanced Mock Test Series (15 Tests)",
        subTitle: "15 JEE Advanced pattern mocks — Paper 1 & Paper 2 with solutions",
        description:
            "The most rigorous mock test series for JEE Advanced aspirants. 15 mocks with both Paper 1 and Paper 2 (single-answer, multi-answer, integer, paragraph-based). Expert-authored solutions and topic-wise category error tracking.",
        category: "Mock Test",
        courseLevel: "Advance",
        coursePrice: 2999,
        lectures: [
            { title: "JEE Advanced Paper Pattern & Marking Scheme Deep Dive", preview: true },
            { title: "Mock 1 – Paper 1 + 2 Solutions", preview: false },
            { title: "Mock 3 – Paper 1 + 2 Solutions", preview: false },
            { title: "Mock 5 – Mid-Series Analysis & Weak Area Workshop", preview: false },
            { title: "Mock 10 – Paper 1 + 2 Solutions", preview: false },
            { title: "Mock 13 – Paper 1 + 2 Solutions", preview: false },
            { title: "Mock 15 – Final Grand Test + Complete Review", preview: false },
        ],
    },

    // ─── PYQ DISCUSSIONS (3 courses) ──────────────────────────────────
    {
        courseTitle: "JEE Mains Previous Year Questions — Last 10 Years (PCM)",
        subTitle: "Chapter-wise PYQ discussion for Physics, Chemistry & Maths (2014–2024)",
        description:
            "Chapter-wise analysis and discussion of all JEE Mains questions from 2014 to 2024. Each question is discussed with the correct approach, common mistakes, shortcuts, and related concepts. Organized by chapter for targeted revision.",
        category: "PYQ Discussion",
        courseLevel: "Medium",
        coursePrice: 1999,
        lectures: [
            { title: "Physics PYQs – Mechanics (2014–2024)", preview: true },
            { title: "Physics PYQs – Electrodynamics & Optics", preview: false },
            { title: "Chemistry PYQs – Physical Chemistry", preview: false },
            { title: "Chemistry PYQs – Organic & Inorganic", preview: false },
            { title: "Maths PYQs – Algebra & Coordinate Geometry", preview: false },
            { title: "Maths PYQs – Calculus & Vectors", preview: false },
            { title: "Trend Analysis & Most Expected Question Types 2025", preview: false },
        ],
    },
    {
        courseTitle: "NEET Previous Year Questions — Last 10 Years (PCB)",
        subTitle: "Chapter-wise NEET PYQ discussion for Physics, Chemistry & Biology (2014–2024)",
        description:
            "Complete chapter-wise discussion of all NEET questions from 2014–2024. Biology (Botany + Zoology) gets extra focus due to its 50% weightage. Includes NCERT-line tracking for each question and one-liner revision notes per chapter.",
        category: "PYQ Discussion",
        courseLevel: "Medium",
        coursePrice: 1999,
        lectures: [
            { title: "Biology PYQs – Cell Biology & Genetics (2014–2024)", preview: true },
            { title: "Biology PYQs – Plant Physiology & Reproduction", preview: false },
            { title: "Biology PYQs – Ecology & Evolution", preview: false },
            { title: "Physics PYQs – Laws of Motion & Thermodynamics", preview: false },
            { title: "Chemistry PYQs – Organic Chemistry Focus", preview: false },
            { title: "Chemistry PYQs – Inorganic & Physical", preview: false },
            { title: "NEET 2024 Full Paper Discussion + 2025 Strategy", preview: false },
        ],
    },
    {
        courseTitle: "JEE Advanced PYQ Discussion — Last 10 Years",
        subTitle: "Detailed solutions and tricks for every JEE Advanced question (2014–2024)",
        description:
            "The most detailed PYQ discussion for JEE Advanced. Every question from 2014–2024 (Paper 1 & Paper 2) is solved with full method, alternate approaches, and concept links. Includes integer-type and multi-correct question strategies.",
        category: "PYQ Discussion",
        courseLevel: "Advance",
        coursePrice: 2499,
        lectures: [
            { title: "JEE Advanced 2024 – Complete Paper Discussion", preview: true },
            { title: "JEE Advanced 2023 – Paper 1 & 2 Discussion", preview: false },
            { title: "JEE Advanced 2022 – Physics Deep Dive", preview: false },
            { title: "JEE Advanced 2021 – Chemistry & Maths Discussion", preview: false },
            { title: "JEE Advanced 2019 & 2020 – Tricky Problems Explained", preview: false },
            { title: "Integer Type Questions – Special Strategy Session", preview: false },
            { title: "Multi-Correct Questions – Patterns & Approach (2014–2018)", preview: false },
        ],
    },
];

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB:", process.env.MONGO_URI);

        // Find or use first available instructor
        let instructor = await User.findOne({ role: "instructor" });
        if (!instructor) {
            instructor = await User.findOne();
        }
        if (!instructor) {
            console.error("❌ No users found. Please register at least one user first.");
            return;
        }
        console.log(`👤 Using instructor: ${instructor.name} (${instructor.email})`);

        let created = 0;
        let skipped = 0;

        for (const [idx, courseData] of coursesData.entries()) {
            // Check if course already exists to avoid duplicates
            const existing = await Course.findOne({ courseTitle: courseData.courseTitle });
            if (existing) {
                console.log(`⏭️  Skipping (already exists): ${courseData.courseTitle}`);
                skipped++;
                continue;
            }

            // Create lectures first
            const lectureIds = [];
            for (const [li, lec] of courseData.lectures.entries()) {
                const lecture = await Lecture.create({
                    lectureTitle: lec.title,
                    videoUrl: getVideo(idx + li),
                    isPreviewFree: lec.preview,
                });
                lectureIds.push(lecture._id);
            }

            // Determine thumbnail
            const thumbnail = THUMBNAILS[courseData.category] || THUMBNAILS["Physics"];

            // Create course
            const course = await Course.create({
                courseTitle: courseData.courseTitle,
                subTitle: courseData.subTitle,
                description: courseData.description,
                category: courseData.category,
                courseLevel: courseData.courseLevel,
                coursePrice: courseData.coursePrice,
                courseThumbnail: thumbnail,
                creator: instructor._id,
                isPublished: true,
                lectures: lectureIds,
            });

            console.log(`✅ [${idx + 1}/20] Created: ${course.courseTitle}`);
            created++;
        }

        console.log("\n🎉 Seeding complete!");
        console.log(`   ✅ Created : ${created} courses`);
        console.log(`   ⏭️  Skipped : ${skipped} courses (already existed)`);
    } catch (error) {
        console.error("❌ Error seeding courses:", error);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB.");
    }
};

seedCourses();
