import { MatchedRecipe, Recipe } from "../types";
import heroFeastImg from "../assets/images/hero_indian_feast_1794550775452.jpg";
import sampleIngredientsImg from "../assets/images/sample_kitchen_ingredients_1794550775503.jpg";
import southIndianDosaImg from "../assets/images/south_indian_dosa_1794550776692.jpg";
import northIndianCurryImg from "../assets/images/north_indian_curry_1794550776198.jpg";
import andhraGuttiVankayaImg from "../assets/images/andhra_gutti_vankaya_1794550777842.jpg";
import telanganaBagharaMuttonImg from "../assets/images/telangana_baghara_mutton_1794550778309.jpg";
import hyderabadiBiryaniImg from "../assets/images/hyderabadi_biryani_1794550778467.jpg";
import palakPaneerBowlImg from "../assets/images/palak_paneer_bowl_1794550778329.jpg";

export const HERO_IMAGE = heroFeastImg;
export const SAMPLE_INGREDIENTS_IMAGE = sampleIngredientsImg;
export const REGION_IMAGES = {
  "South Indian": southIndianDosaImg,
  "North Indian": northIndianCurryImg,
  Andhra: andhraGuttiVankayaImg,
  Telangana: telanganaBagharaMuttonImg,
} as const;

export const RECIPES: Recipe[] = [
  {
    id: "paneer-butter-masala",
    title: "Paneer Butter Masala",
    region: "North Indian",
    diet: "Vegetarian",
    cookingTime: "35 mins",
    cookingMinutes: 35,
    difficulty: "Easy",
    servings: 4,
    image: northIndianCurryImg,
    description:
      "Silky tomato-cashew gravy finished with butter, aromatic kasuri methi, and tender paneer cubes.",
    requiredIngredients: [
      "Paneer",
      "Tomatoes",
      "Red Onions",
      "Ginger",
      "Garlic",
      "Green Chilies",
      "Turmeric Powder",
      "Fresh Coriander",
      "Butter",
      "Cashews",
      "Garam Masala",
      "Cream",
    ],
    instructions: [
      "Sauté sliced red onions, ripe tomatoes, ginger, garlic, and soaked cashews in 1 tbsp butter until tomatoes collapse completely.",
      "Cool the mixture slightly and blend into a velvety smooth puree; strain if desired for a restaurant-style silkiness.",
      "Melt remaining butter in a kadai, add Kashmiri red chili powder and turmeric on low heat, then pour in the strained tomato puree.",
      "Simmer for 8–10 minutes until the gravy thickens and butter begins to glisten along the edges.",
      "Fold in cubed paneer, crushed kasuri methi, and garam masala; simmer gently for 3 minutes.",
      "Finish with a swirl of cream and chopped fresh coriander. Serve hot with garlic naan or jeera rice.",
    ],
  },
  {
    id: "palak-paneer",
    title: "Dhaba-Style Palak Paneer",
    region: "North Indian",
    diet: "Vegetarian",
    cookingTime: "30 mins",
    cookingMinutes: 30,
    difficulty: "Easy",
    servings: 3,
    image: palakPaneerBowlImg,
    description:
      "Vibrant blanched spinach puree tempered with toasted cumin, garlic, and golden pan-seared paneer.",
    requiredIngredients: [
      "Spinach",
      "Paneer",
      "Tomatoes",
      "Red Onions",
      "Ginger",
      "Garlic",
      "Green Chilies",
      "Cumin Seeds",
      "Turmeric Powder",
      "Fresh Coriander",
      "Garam Masala",
    ],
    instructions: [
      "Blanch washed spinach leaves in boiling water for 2 minutes, then immediately plunge into ice-cold water to lock in the emerald green color.",
      "Blend the drained spinach with green chilies and fresh coriander into a smooth puree.",
      "Pan-sear paneer cubes in a teaspoon of ghee until lightly golden on two sides; keep warm in salted water so they stay soft.",
      "In the same pan, crackle cumin seeds, sauté finely chopped onions, ginger, and garlic until golden, then cook chopped tomatoes with turmeric.",
      "Pour in the spinach puree, season with salt and garam masala, and simmer gently for 4 minutes.",
      "Fold in the seared paneer cubes and top with a quick tempering of whole cumin and dried red chili.",
    ],
  },
  {
    id: "masala-dosa",
    title: "Crispy Masala Dosa",
    region: "South Indian",
    diet: "Vegetarian",
    cookingTime: "35 mins",
    cookingMinutes: 35,
    difficulty: "Medium",
    servings: 4,
    image: southIndianDosaImg,
    description:
      "Golden fermented rice-lentil crepes folded around spiced turmeric potato masala, served with chutney and sambar.",
    requiredIngredients: [
      "Dosa Batter",
      "Potatoes",
      "Red Onions",
      "Green Chilies",
      "Curry Leaves",
      "Turmeric Powder",
      "Mustard Seeds",
      "Chana Dal",
      "Ginger",
      "Fresh Coriander",
    ],
    instructions: [
      "Boil, peel, and coarsely mash potatoes while keeping a few bite-sized chunks.",
      "Heat oil in a skillet; crackle mustard seeds, chana dal, and fresh curry leaves, then sauté sliced onions, green chilies, and grated ginger.",
      "Stir in turmeric powder and mashed potatoes with a splash of water and salt; finish with chopped coriander.",
      "Spread a ladle of fermented dosa batter thinly in concentric circles onto a hot cast-iron tawa.",
      "Drizzle ghee or oil along the edges until the dosa turns crisp and deep golden brown.",
      "Place a generous scoop of potato masala inside, fold cleanly, and serve immediately with coconut chutney and steaming sambar.",
    ],
  },
  {
    id: "gutti-vankaya",
    title: "Andhra Gutti Vankaya Kura",
    region: "Andhra",
    diet: "Vegetarian",
    cookingTime: "45 mins",
    cookingMinutes: 45,
    difficulty: "Medium",
    servings: 4,
    image: andhraGuttiVankayaImg,
    description:
      "Tender baby brinjals stuffed with a roasted peanut, sesame, and tamarind spice paste simmered until rich and glossy.",
    requiredIngredients: [
      "Baby Brinjals",
      "Peanuts",
      "Sesame Seeds",
      "Red Onions",
      "Tomatoes",
      "Curry Leaves",
      "Garlic",
      "Ginger",
      "Turmeric Powder",
      "Tamarind",
      "Red Chili Powder",
      "Fresh Coriander",
    ],
    instructions: [
      "Dry roast peanuts, white sesame seeds, coriander seeds, cumin, and dried red chilies until aromatic; grind with onion, garlic, ginger, tamarind, and salt into a coarse paste.",
      "Make a deep cross-slit at the base of each baby brinjal keeping the stems intact, and soak in salted water briefly.",
      "Stuff each brinjal generously with half of the spiced peanut-sesame paste.",
      "Heat sesame or groundnut oil in a wide heavy pan; add curry leaves and arrange the stuffed brinjals in a single layer.",
      "Cover and slow-cook on low heat, turning gently every 4–5 minutes until skins blister and soften.",
      "Add remaining spice paste, chopped tomatoes, turmeric, and half a cup of water; simmer uncovered until oil separates. Garnish with coriander.",
    ],
  },
  {
    id: "hyderabadi-dum-biryani",
    title: "Hyderabadi Chicken Dum Biryani",
    region: "Telangana",
    diet: "Non-Vegetarian",
    cookingTime: "65 mins",
    cookingMinutes: 65,
    difficulty: "Hard",
    servings: 5,
    image: hyderabadiBiryaniImg,
    description:
      "Fragrant long-grain basmati rice layered over spiced yogurt-marinated chicken, saffron milk, mint, and crispy birista onions.",
    requiredIngredients: [
      "Chicken",
      "Basmati Rice",
      "Red Onions",
      "Yogurt",
      "Tomatoes",
      "Ginger",
      "Garlic",
      "Green Chilies",
      "Mint Leaves",
      "Fresh Coriander",
      "Turmeric Powder",
      "Garam Masala",
      "Saffron",
      "Ghee",
    ],
    instructions: [
      "Thinly slice red onions and fry in oil until crisp and deep golden brown (birista); reserve half for layering.",
      "Marinate chicken with thick yogurt, ginger-garlic paste, slit green chilies, turmeric, red chili powder, garam masala, mint, coriander, and half the fried onions for 45 minutes.",
      "Parboil soaked basmati rice with whole spices (bay leaf, cardamom, cloves, cinnamon) until 70% cooked, then drain.",
      "Spread marinated chicken across a heavy handi pot, layer the 70%-cooked rice over it, and drizzle warm saffron milk and ghee on top.",
      "Scatter remaining mint, coriander, and crispy fried onions, seal the lid tightly, and cook on high for 4 minutes then very low dum heat for 25 minutes.",
      "Rest 10 minutes before gently fluffing from the side. Serve with cool cucumber raita.",
    ],
  },
  {
    id: "telangana-mamsam-baghara",
    title: "Telangana Mamsam Kura & Baghara Rice",
    region: "Telangana",
    diet: "Non-Vegetarian",
    cookingTime: "55 mins",
    cookingMinutes: 55,
    difficulty: "Medium",
    servings: 4,
    image: telanganaBagharaMuttonImg,
    description:
      "Bold rural Telangana mutton curry simmered with roasted dry coconut and poppy-coriander masala alongside spiced Baghara rice.",
    requiredIngredients: [
      "Mutton",
      "Basmati Rice",
      "Red Onions",
      "Tomatoes",
      "Ginger",
      "Garlic",
      "Green Chilies",
      "Curry Leaves",
      "Turmeric Powder",
      "Fresh Coriander",
      "Dry Coconut",
      "Red Chili Powder",
      "Garam Masala",
    ],
    instructions: [
      "Marinate mutton pieces with turmeric, salt, red chili powder, and ginger-garlic paste for 20 minutes.",
      "Dry roast desiccated coconut, coriander seeds, cloves, and cinnamon; grind to a fine Telangana masala paste.",
      "Brown sliced onions and curry leaves in oil, sear the marinated mutton on high heat for 5 minutes, then stir in chopped tomatoes.",
      "Pressure cook or slow-simmer with water until mutton is fork-tender, then fold in the roasted coconut masala and simmer 8 minutes more.",
      "For Baghara rice, temper whole spices, slit green chilies, and sliced onions in ghee; add soaked rice and water (1:1.75) and cook until fluffy.",
      "Finish the curry with plenty of fresh coriander and serve hot with aromatic Baghara rice.",
    ],
  },
  {
    id: "andhra-tomato-pappu",
    title: "Andhra Tomato Pappu",
    region: "Andhra",
    diet: "Vegetarian",
    cookingTime: "25 mins",
    cookingMinutes: 25,
    difficulty: "Easy",
    servings: 4,
    image: andhraGuttiVankayaImg,
    description:
      "Comforting coastal Andhra yellow lentil dal simmered with tangy ripe tomatoes, green chilies, garlic, and crisp curry-leaf tempering.",
    requiredIngredients: [
      "Toor Dal",
      "Tomatoes",
      "Red Onions",
      "Green Chilies",
      "Garlic",
      "Curry Leaves",
      "Turmeric Powder",
      "Mustard Seeds",
      "Cumin Seeds",
      "Fresh Coriander",
      "Ghee",
    ],
    instructions: [
      "Rinse toor dal thoroughly and pressure-cook with chopped tomatoes, sliced onions, slit green chilies, turmeric powder, and a drop of oil until soft and mushy.",
      "Lightly mash the cooked dal and tomatoes together with a wooden mathani or ladle; add salt and a small pinch of tamarind pulp if tomatoes are sweet.",
      "In a small tadka pan, heat ghee and crackle mustard seeds, cumin seeds, crushed garlic cloves, dried red chilies, and fresh curry leaves.",
      "Pour the sizzling tempering directly over the hot pappu and cover for 1 minute to trap the aroma.",
      "Garnish with fresh coriander and serve over steaming rice with a spoon of ghee.",
    ],
  },
  {
    id: "andhra-kodi-vepudu",
    title: "Andhra Kodi Vepudu (Spicy Chicken Fry)",
    region: "Andhra",
    diet: "Non-Vegetarian",
    cookingTime: "40 mins",
    cookingMinutes: 40,
    difficulty: "Medium",
    servings: 4,
    image: telanganaBagharaMuttonImg,
    description:
      "Pan-roasted Andhra chicken tossed in fiery Guntur chili, freshly cracked black pepper, caramelized onions, and crisp curry leaves.",
    requiredIngredients: [
      "Chicken",
      "Red Onions",
      "Curry Leaves",
      "Green Chilies",
      "Ginger",
      "Garlic",
      "Turmeric Powder",
      "Fresh Coriander",
      "Black Pepper",
      "Red Chili Powder",
      "Lemon",
    ],
    instructions: [
      "Toss bone-in or boneless chicken pieces with turmeric, salt, red chili powder, lemon juice, and ginger-garlic paste; rest 20 minutes.",
      "Heat oil in a wide skillet; add sliced onions, slit green chilies, and two sprigs of curry leaves, sautéing until deeply caramelized.",
      "Add the marinated chicken and cook uncovered on medium-high heat for 6 minutes until juices release.",
      "Lower heat, cover for 12 minutes so chicken cooks through in its own juices, then uncover to evaporate moisture.",
      "Sprinkle freshly roasted cumin-coriander powder and coarsely crushed black pepper; roast until dry, glossy, and crisp at the edges.",
      "Finish with fresh coriander leaves and serve with rasam rice or parotta.",
    ],
  },
  {
    id: "chettinad-chicken",
    title: "South Indian Chettinad Chicken",
    region: "South Indian",
    diet: "Non-Vegetarian",
    cookingTime: "45 mins",
    cookingMinutes: 45,
    difficulty: "Medium",
    servings: 4,
    image: hyderabadiBiryaniImg,
    description:
      "Aromatic Karaikudi-style chicken curry driven by freshly toasted fennel, star anise, kalpasi, curry leaves, and ripe tomatoes.",
    requiredIngredients: [
      "Chicken",
      "Tomatoes",
      "Red Onions",
      "Curry Leaves",
      "Ginger",
      "Garlic",
      "Green Chilies",
      "Turmeric Powder",
      "Fresh Coriander",
      "Fennel Seeds",
      "Black Pepper",
    ],
    instructions: [
      "Dry roast fennel seeds, black peppercorns, coriander seeds, dried red chilies, cinnamon, cloves, and grated coconut; grind into a fragrant paste.",
      "Heat gingelly (sesame) oil in a heavy pot; crackle curry leaves and sauté finely chopped onions until golden.",
      "Stir in ginger-garlic paste and slit green chilies, followed by chopped tomatoes and turmeric powder until oil separates.",
      "Add chicken pieces and sear well for 5 minutes before folding in the freshly ground Chettinad masala paste.",
      "Add 1 cup warm water, cover, and simmer 18 minutes until chicken is tender and gravy coats each piece.",
      "Garnish with fresh coriander and crispy fried curry leaves. Serve with flaky parotta or steamed rice.",
    ],
  },
  {
    id: "telangana-baghara-baingan",
    title: "Telangana Baghara Baingan",
    region: "Telangana",
    diet: "Vegetarian",
    cookingTime: "40 mins",
    cookingMinutes: 40,
    difficulty: "Medium",
    servings: 4,
    image: andhraGuttiVankayaImg,
    description:
      "Charred baby eggplants simmered in a rich Hyderabad-Telangana sesame, peanut, coconut, and tangy tamarind curry.",
    requiredIngredients: [
      "Baby Brinjals",
      "Peanuts",
      "Sesame Seeds",
      "Dry Coconut",
      "Red Onions",
      "Tomatoes",
      "Ginger",
      "Garlic",
      "Curry Leaves",
      "Turmeric Powder",
      "Tamarind",
      "Fresh Coriander",
    ],
    instructions: [
      "Slit small purple eggplants into quarters keeping the stem attached and pan-sear in oil until 70% tender; set aside.",
      "Roast peanuts, sesame seeds, dry coconut, and cumin seeds; blend with sautéed onions into a smooth nutty paste.",
      "In the same pan, temper mustard seeds, fenugreek seeds, curry leaves, and ginger-garlic paste.",
      "Add the ground nut-coconut paste, turmeric, red chili powder, and chopped tomatoes; cook gently stirring often until oil surfaces.",
      "Pour in thin tamarind extract and 1 cup water, bring to a boil, then gently place the seared eggplants into the gravy.",
      "Simmer on low heat for 12 minutes until glossy and tender. Garnish with fresh coriander and pair with biryani.",
    ],
  },
  {
    id: "old-delhi-butter-chicken",
    title: "Old Delhi Murgh Makhani (Butter Chicken)",
    region: "North Indian",
    diet: "Non-Vegetarian",
    cookingTime: "50 mins",
    cookingMinutes: 50,
    difficulty: "Medium",
    servings: 4,
    image: northIndianCurryImg,
    description:
      "Charred tandoori-spiced chicken simmered in a velvety spiced tomato-butter sauce lifted with fenugreek leaves.",
    requiredIngredients: [
      "Chicken",
      "Tomatoes",
      "Red Onions",
      "Yogurt",
      "Ginger",
      "Garlic",
      "Green Chilies",
      "Turmeric Powder",
      "Butter",
      "Cream",
      "Garam Masala",
      "Fresh Coriander",
    ],
    instructions: [
      "Marinate boneless chicken thighs in hung yogurt, ginger-garlic paste, Kashmiri chili, turmeric, and lemon juice for 30 minutes.",
      "Pan-sear or grill the chicken pieces on high heat until lightly charred around the edges.",
      "Simmer chopped tomatoes, onions, ginger, garlic, and whole cardamom until soft, then blend and pass through a fine strainer.",
      "In a clean pan, melt butter, pour in the smooth tomato velvet sauce, and simmer with Kashmiri chili and honey/sugar for balance.",
      "Slide in the charred chicken pieces, crushed kasuri methi, and garam masala; simmer 8 minutes.",
      "Finish with cream and chopped coriander; serve warm with butter naan.",
    ],
  },
  {
    id: "vegetable-sambar",
    title: "Traditional South Indian Vegetable Sambar",
    region: "South Indian",
    diet: "Vegetarian",
    cookingTime: "35 mins",
    cookingMinutes: 35,
    difficulty: "Easy",
    servings: 4,
    image: southIndianDosaImg,
    description:
      "Wholesome lentil and mixed vegetable stew infused with tamarind, roasted sambar powder, shallots, and curry-leaf tadka.",
    requiredIngredients: [
      "Toor Dal",
      "Tomatoes",
      "Red Onions",
      "Drumstick",
      "Carrots",
      "Curry Leaves",
      "Turmeric Powder",
      "Tamarind",
      "Mustard Seeds",
      "Green Chilies",
      "Fresh Coriander",
    ],
    instructions: [
      "Pressure-cook rinsed toor dal with a pinch of turmeric until soft and creamy; mash smoothly.",
      "Boil diced carrots, drumsticks, tomatoes, shallots, and green chilies in diluted tamarind water with salt and turmeric until tender.",
      "Stir in homemade or artisanal sambar powder and simmer 5 minutes so the raw spice aroma mellows.",
      "Pour in the cooked toor dal and adjust consistency with hot water; simmer gently for another 5 minutes.",
      "Heat ghee in a small pan, crackle mustard seeds, fenugreek seeds, dried red chilies, asafoetida, and fresh curry leaves.",
      "Pour the tempering over the bubbling sambar and garnish with chopped fresh coriander.",
    ],
  },
];

// Normalize ingredient strings for resilient matching across plurals & common aliases
const INGREDIENT_ALIASES: Record<string, string[]> = {
  tomatoes: ["tomato", "tomatoes", "cherry tomatoes", "roma tomato"],
  "red onions": ["onion", "onions", "red onion", "red onions", "shallots"],
  "green chilies": [
    "green chili",
    "green chilies",
    "green chilli",
    "green chillies",
    "chili",
    "chilies",
    "thai chili",
  ],
  "fresh coriander": [
    "coriander",
    "fresh coriander",
    "cilantro",
    "coriander leaves",
  ],
  "curry leaves": ["curry leaf", "curry leaves", "kadi patta"],
  ginger: ["ginger", "ginger root", "ginger paste"],
  garlic: ["garlic", "garlic cloves", "garlic paste"],
  "turmeric powder": ["turmeric", "turmeric powder", "haldi", "turmeric root"],
  paneer: ["paneer", "cottage cheese", "indian cottage cheese"],
  chicken: ["chicken", "chicken breast", "chicken thighs", "chicken pieces"],
  mutton: ["mutton", "lamb", "goat meat"],
  "baby brinjals": ["brinjal", "eggplant", "aubergine", "baby brinjals"],
  spinach: ["spinach", "palak", "baby spinach"],
  potatoes: ["potato", "potatoes", "aloo"],
  "basmati rice": ["rice", "basmati rice", "white rice"],
  "toor dal": ["toor dal", "dal", "lentils", "yellow lentils", "pigeon peas"],
  yogurt: ["yogurt", "curd", "dahi", "greek yogurt"],
};

function normalizeTerm(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "");
}

function ingredientMatches(required: string, availableList: string[]): boolean {
  const reqNorm = normalizeTerm(required);
  const reqAliases = INGREDIENT_ALIASES[reqNorm] || [reqNorm];

  return availableList.some((avail) => {
    const availNorm = normalizeTerm(avail);
    if (!availNorm) return false;
    if (reqNorm === availNorm) return true;
    if (reqNorm.includes(availNorm) || availNorm.includes(reqNorm)) return true;

    for (const alias of reqAliases) {
      if (alias === availNorm || alias.includes(availNorm) || availNorm.includes(alias)) {
        return true;
      }
    }
    return false;
  });
}

export function matchRecipesToIngredients(
  recipes: Recipe[],
  userIngredients: string[]
): MatchedRecipe[] {
  const cleaned = userIngredients.map((i) => i.trim()).filter(Boolean);

  return recipes
    .map((recipe) => {
      const matchedIngredients: string[] = [];
      const missingIngredients: string[] = [];

      for (const req of recipe.requiredIngredients) {
        if (cleaned.length > 0 && ingredientMatches(req, cleaned)) {
          matchedIngredients.push(req);
        } else {
          missingIngredients.push(req);
        }
      }

      const matchPercentage =
        recipe.requiredIngredients.length > 0
          ? Math.round(
              (matchedIngredients.length / recipe.requiredIngredients.length) *
                100
            )
          : 0;

      return {
        ...recipe,
        matchPercentage,
        matchedIngredients,
        missingIngredients,
      };
    })
    .sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      return b.matchedIngredients.length - a.matchedIngredients.length;
    });
}
