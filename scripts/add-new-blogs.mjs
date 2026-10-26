import fs from 'fs';
import path from 'path';

const projectRoot = 'c:/Users/Admin/Desktop/hipa-masala-website';
const blogPostsPath = path.join(projectRoot, 'data/blog-posts.json');
const hipaContentPath = path.join(projectRoot, 'shared/hipaContent.ts');

const existingBlogs = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Filter out any previous run's additions if rerun, preserving all 11 original blogs
const originalBlogs = existingBlogs.filter(b => b.id <= 230011);

const newBlogs = [
  {
    id: 230012,
    slug: "how-to-make-sambar-hipa-sambar-powder",
    title: "How to Make Better Sambar with HIPA Sambar Powder: Salt, Dal, Vegetables, and More",
    description: "Learn how to season sambar, choose the right amount of dal, add vegetables, balance sweetness, and use HIPA Sambar Powder in your cooking.",
    body: `Sambar is a comforting South Indian dish made in many different ways. Its flavor can change with the choice of dal, vegetables, tamarind, seasoning, and sambar powder. If you're making it at home, HIPA Sambar Powder is a convenient seasoning option made with coriander, dried red chillies, cumin, fenugreek, black pepper, toor dal, chana dal, turmeric, and asafoetida. Check the [HIPA Sambar Powder product page](/products/sambar-powder) for the full ingredient list and current usage guidance.

This guide answers common questions about making sambar, from how much salt and dal to use to why sambar is often yellow and whether a little sugar belongs in it.

## How much salt should you add to sambar?

There is no single salt measurement that works for every sambar recipe. The right amount depends on the quantity of water, dal, vegetables, and tamarind. HIPA Sambar Powder contains no added salt, according to its official product information, but always check the packaging of any blend you use.

Start with a small amount of salt while the sambar is cooking. Taste it after the ingredients have simmered together, then adjust gradually.

> **Tip:** Tamarind contributes sourness, and vegetables can affect the final flavor. Taste the cooked sambar before making your final seasoning adjustment.

## How much dal should you add to sambar?

The amount of dal depends on how thick you like your sambar and how much you're preparing. A higher proportion of cooked dal generally makes the dish thicker, while more water makes it thinner.

For a first attempt, follow a tested recipe's dal-to-water proportions, then adjust the consistency to your preference. Cook the dal until soft and mash it before combining it with the vegetables and seasonings. If the sambar becomes too thick, add hot water a little at a time and simmer briefly.

For product-specific seasoning guidance, see the [HIPA Sambar Powder page](/products/sambar-powder), which lists a suggested quantity for a family-sized preparation.

## What is the best masala brand for sambar?

The "best" sambar masala depends on the flavor you enjoy, the ingredients you prefer, and how convenient the product is for your cooking. Compare product labels, check for allergens, and follow each brand's preparation instructions.

If you're considering HIPA, explore the details for [HIPA Sambar Powder](/products/sambar-powder), including its ingredient list, flavor profile, pack sizes, and suggested uses. Start with the quantity stated on the label—or a smaller amount if you're unsure—and adjust after tasting.

## Can you put sugar in sambar?

Some cooks add a small amount of sugar or jaggery to balance a particularly tangy sambar, while others prefer not to sweeten it. It is optional, not essential.

First taste the sambar after adding tamarind and sambar powder. If the sourness feels too strong, adjust the balance gradually. You can also review the quantities of tamarind and water in your recipe before adding a sweetener.

## When does sambar become more yellow?

Sambar's color comes from its ingredients and proportions. Turmeric and the spices in the sambar powder can influence the final shade. Different powders and recipes can produce different colors, so sambar is not always the same shade of yellow.

HIPA Sambar Powder includes turmeric in its listed ingredients. For the full blend details, see the product ingredients and information. Don't add extra turmeric just to make the dish more yellow; too much can affect the flavor.

## Is sambar good for health?

Sambar's nutritional content depends on the ingredients and how it is prepared. Dal contributes nutrients, while vegetables add variety to the dish. The amount of salt, oil, and other ingredients also affects the overall meal.

The National Institute of Nutrition's Indian Food Composition Tables provides nutrient data for individual foods, but it does not determine the nutrition of every sambar recipe. For specific dietary needs, consider the full recipe and consult a qualified health professional.

## Is sambar dal good for health?

Dal is a common ingredient in sambar and contributes nutrients to the dish. The final nutritional value depends on the quantity used, the rest of the ingredients, and the portion served. Sambar can be part of a varied meal, but it should not be described as a treatment or guaranteed health solution.

## Why does sambar have so many vegetables?

Vegetables add different textures and flavors to sambar and make it easy to adapt to what is available. Common choices vary by household and region. You can use one or several vegetables, cut them into similar-sized pieces, and cook them until tender without losing their shape.

When adding vegetables, consider how quickly each one cooks. Add firm vegetables earlier and quicker-cooking vegetables later so they finish at about the same time.

## Why is sambar so famous in South India?

Sambar is widely enjoyed across South India and appears in many home and restaurant meals. It is served in different ways, including with rice, idli, and dosa. Recipes vary between regions and households, so there isn't just one version of sambar.

Food history can be complex. One account describes a connection to the Maratha royal kitchen in Thanjavur, with lively debate among food historians and culinary enthusiasts. It's accurate to say that sambar has a rich and debated history across Tamil Nadu and South India.

## Make your next pot of sambar your own

A good sambar comes down to balance: tender dal, vegetables cooked to your liking, seasoning adjusted to taste, and a consistency you enjoy. [HIPA Sambar Powder](/products/sambar-powder) is made for authentic South Indian sambar and can also be explored through its official product details. Browse all [HIPA Masala products](/products) to see the wider spice range.

Have a question about the product or bulk supply? Visit the [HIPA Masala contact page](/contact) or [B2B enquiries page](/b2b-enquiries) to get in touch.`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/how-to-make-better-sambar-hipa-sambar-powder.webp",
    coverImageAlt: "A bowl of authentic South Indian sambar prepared with HIPA Sambar Powder and fresh garden vegetables",
    status: "published",
    publishedAt: "2026-10-26T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-26T10:00:00.000Z",
    updatedAt: "2026-10-26T10:00:00.000Z",
  },
  {
    id: 230013,
    slug: "secret-to-restaurant-style-south-indian-rasam",
    title: "The Secret to Restaurant-Style South Indian Rasam: Pepper, Cumin & Tamarind Balance",
    description: "Master the delicate balance of crushed black pepper, roasted cumin, and ripe tamarind for authentic, digestive South Indian rasam at home.",
    body: `A great South Indian rasam is invigorating, aromatic, and deeply satisfying. Unlike thick curries or hearty sambar, rasam is a clear, digestive broth that relies on volatile essential oils from freshly crushed spices.

When done right, each spoonful delivers a sharp peppery warmth, an earthy roasted cumin fragrance, and a gentle tamarind tang that cleanses the palate. Here is the culinary science behind achieving authentic restaurant-style rasam at home.

## The Holy Trinity of Rasam: Pepper, Cumin, and Tamarind

Every traditional Tamil or South Indian rasam is built upon three foundational flavour pillars:

1. **Black Peppercorns (Milagu):** Delivers clean piperine heat that warms the throat without scorching the palate like chillies do.
2. **Cumin Seeds (Jeera):** Provides digestive cuminaldehyde warmth and a nutty, roasted foundation.
3. **Ripe Tamarind (Puli):** Contributes balanced malic and tartaric acidity that extracts essential oils from the spices.

In [HIPA Rasam Powder](/products/rasam-powder), these ingredients are proportioned in authentic South Indian culinary ratios, slow-roasted, and milled to preserve their natural volatile oils.

## Why Boiling Rasam Too Long Destroys the Flavour

The single biggest mistake home cooks make with rasam is treating it like sambar and boiling it vigorously for 10–15 minutes.

- **The Golden Rule:** Rasam must only be brought to a single gentle simmer until a thick, frothy golden foam (*nurram*) rises to the surface.
- The moment the foam forms, immediately turn off the flame. Boiling rasam too long causes the delicate piperine and essential oils of coriander and cumin to vaporise into the air, leaving behind a flat or unpleasantly bitter liquid.

## The Secret Tadka (Tempering) in Pure Ghee

A restaurant-quality rasam finishes with a sizzling aromatic tempering (*thalippu*):

- Heat one teaspoon of pure cow ghee or cold-pressed sesame oil.
- Splutter black mustard seeds and a pinch of fenugreek seeds.
- Add freshly torn curry leaves, dried red chilli, and a generous pinch of asafoetida (compounded hing).
- Pour the hot tempering immediately into the pot and cover with a lid for 3 minutes to trap the aromatic vapours.

## Troubleshooting Common Rasam Pitfalls

| Problem | Cause | Quick Chef Fix |
| --- | --- | --- |
| Rasam tastes unpleasantly sour | Too much tamarind or under-extracted water | Add 2 tablespoons of cooked toor dal water or a marble-sized piece of jaggery |
| Rasam tastes bitter | Fenugreek or cumin was over-roasted or boiled too long | Dilute with fresh warm water and add chopped ripe tomatoes |
| Flavour feels weak or watery | Spices were stale or added too late | Use freshly ground [HIPA Rasam Powder](/products/rasam-powder) and temper with hot ghee |

Explore [HIPA Masala's pure spice blends](/products) to elevate your everyday home cooking.`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/secret-to-restaurant-style-south-indian-rasam.webp",
    coverImageAlt: "Steaming hot South Indian rasam in a traditional bowl with fresh curry leaves, cumin and black pepper",
    status: "published",
    publishedAt: "2026-10-25T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-25T10:00:00.000Z",
    updatedAt: "2026-10-25T10:00:00.000Z",
  },
  {
    id: 230014,
    slug: "pure-turmeric-powder-vs-adulterated-home-test",
    title: "Pure Turmeric Powder vs Adulterated Turmeric: 4 Simple Home Tests",
    description: "Simple home water tests to detect chalk, starch, and synthetic yellow dyes in turmeric powder. Learn how HIPA delivers 100% pure curcumin-rich turmeric.",
    body: `Turmeric is revered across India not only as an essential culinary colourant but as a daily health staple. Its characteristic golden hue and wellness properties are driven by **curcumin**, a natural polyphenol found in mature turmeric rhizomes.

However, commercial turmeric powders are frequently adulterated with cheap extenders like chalk, corn starch, saw dust, and dangerous non-permitted chemical dyes such as **metanil yellow** and lead chromate.

Here are four simple, verified home tests you can run in your kitchen to verify your turmeric powder's authenticity.

## Test 1: The Glass of Warm Water Test

This is the easiest and most reliable test for everyday kitchen detection:

1. Fill a clear glass with warm water.
2. Drop 1 teaspoon of turmeric powder onto the water surface without stirring.
3. Observe the settling behavior for 15–20 minutes:
   - **Pure Turmeric:** Slowly and naturally settles down to the bottom of the glass. The water above remains clear or pale, light yellow.
   - **Adulterated Turmeric:** Stays cloudy, milky, or turns a harsh neon yellow, indicating water-soluble synthetic dyes or chalk suspensions.

## Test 2: The Hydrochloric Acid / Lemon Juice Chemical Test

Metanil yellow is a carcinogenic synthetic dye banned in food processing under FSSAI regulations.

- Put a small pinch of turmeric in a shallow white dish.
- Add a few drops of concentrated acid (or fresh lime juice / clear vinegar).
- If the mixture instantly turns a vivid magenta or violet that remains intense even after adding water, synthetic chemical dyes are present. Pure turmeric will remain yellow or turn a natural deep amber.

## Test 3: The Palm Rubbing & Staining Texture Test

- Take a small pinch of turmeric on the palm of your left hand.
- Rub it firmly with your right thumb for 20 seconds.
- Pure ground turmeric will feel fine, silky, and leave a deep golden-yellow stain on the skin that does not easily wash away with plain water. If it leaves a dusty, powdery residue that rinses off instantly like flour, starch or talc has been blended in.

## Test 4: The Blotting Paper Water Drop Test

- Place a teaspoon of turmeric on an absorbent paper towel or blotting paper.
- Place 2–3 drops of water on the powder.
- Pure turmeric allows water to seep evenly, producing a soft ring. Adulterated turmeric will cause artificial dyes to bleed out into sharp, fluorescent yellow or orange fringes.

## How HIPA Masala Guarantees Purity

At HIPA Enterprises in Pallavaram, Chennai, our [Turmeric Powder](/products/turmeric-powder) is manufactured under rigorous FSSAI standards:

- **100% Whole Rhizome Sourcing:** We source only mature, naturally sun-cured whole turmeric fingers.
- **Zero Synthetic Colours or Fillers:** No metanil yellow, no chalk, no foreign starches.
- **Low-Temperature Milling:** Ensures natural essential oils (turmerone and curcuminoids) remain intact.

Learn more about our [food safety and manufacturing standards](/masala-manufacturer-in-chennai) or explore our [pure spice range](/products).`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/pure-turmeric-powder-vs-adulterated-home-test.webp",
    coverImageAlt: "Pure golden turmeric powder in wooden bowls alongside fresh whole turmeric roots",
    status: "published",
    publishedAt: "2026-10-24T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-24T10:00:00.000Z",
    updatedAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: 230015,
    slug: "cold-grinding-vs-high-speed-milling-spices",
    title: "Cold Grinding vs High-Speed Milling: Why Temperature Matters in Spices",
    description: "Discover why traditional low-temperature milling protects heat-sensitive essential oils in coriander, chilli, and cumin powders for longer freshness.",
    body: `When whole spices are ground into fine powders, mechanical friction inevitably generates heat. In mass-scale industrial pulverizers running at 3,000 to 5,000 RPM, temperatures inside the milling chamber regularly exceed 85°C to 100°C.

To the consumer, the resulting spice powder looks normal. But under a laboratory microscope, the difference is night and day: excessive heat scorches delicate essential oils, vaporising the aromatic volatile compounds before the spice ever reaches a kitchen.

## The Chemistry of Spice Aromas

The fragrance and medicinal value of Indian spices reside entirely in microscopic volatile oils:

- **Coriander Powder:** Linalool and geranyl acetate (boiling point: 60°C).
- **Cumin Powder:** Cuminaldehyde and terpene hydrocarbons (heat-sensitive).
- **Black Pepper:** Piperine and caryophyllene.
- **Turmeric Powder:** Curcuminoids and turmerone.

When spices are ground at high temperatures, these volatile oils evaporate into the mill exhaust air. What ends up in the pouch is partially exhausted fibre with dull colour and reduced aroma.

## What is Low-Temperature Cold Milling?

Low-temperature grinding (often referred to as cool milling or slow grinding) regulates the internal chamber temperature below 45°C throughout the entire pulverisation process:

1. **Slow-Speed Multi-Stage Milling:** Spices are reduced gradually in stages rather than blasted in a single high-impact pass.
2. **Cold Air Circulation:** Continuous chilled air passes through the milling cyclonic separators, carrying heat away instantly.
3. **Moisture Equilibrium:** Ambient relative humidity is controlled so powders do not absorb moisture or cake together.

## Cold Grinding vs High-Speed Commercial Milling

| Factor | High-Speed Pulverizing (80°C - 100°C) | HIPA Controlled Low-Temp Milling (<45°C) |
| --- | --- | --- |
| Essential Oil Retention | 40% – 60% lost to friction heat | >92% volatile natural oils retained |
| Flavour Potency in Cooking | Requires larger quantities for flavour | Strong aroma with smaller kitchen pinches |
| Shelf Life & Stability | Dulls and turns stale in 3–4 months | Stays fresh and fragrant for 12 months |
| Colour & Pigment | Darkened or toasted from heat stress | Vibrant natural crop colour preserved |

## Why Chefs and Caterers Prefer Cold-Milled Spices

Professional South Indian caterers and cloud kitchens in Chennai rely on spice consistency. When a spice powder retains its natural oil density:

- Gravies achieve a natural gloss without needing excessive added cooking oil.
- Less powder is required per dish, reducing cost per plate.
- The aroma blooms instantly when tempered into hot oil or ghee.

Discover HIPA Masala's [range of low-temperature milled spices](/products) or explore [B2B bulk orders for food businesses](/b2b-enquiries).`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/cold-grinding-vs-high-speed-milling-spices.webp",
    coverImageAlt: "Traditional spice grinding stones and modern clean low-temperature spice milling equipment",
    status: "published",
    publishedAt: "2026-10-23T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-23T10:00:00.000Z",
    updatedAt: "2026-10-23T10:00:00.000Z",
  },
  {
    id: 230016,
    slug: "essential-south-indian-spice-box-guide",
    title: "The Essential South Indian Spice Box: 8 Cornerstone Spices Every Kitchen Needs",
    description: "From sun-dried coriander and golden turmeric to fiery Guntur red chilli and roasted cumin, discover the 8 essential spices in traditional Tamil cuisine.",
    body: `In any traditional South Indian home, the round stainless steel or bronze spice box (*anjarai petti* or *masala dabba*) is the beating heart of the kitchen. While North Indian spice boxes often feature whole garam masala seeds, a South Indian spice array is precision-engineered for tempering, digestive balance, and vibrant everyday gravies.

Here are the 8 cornerstone spices and masalas that define the soul of South Indian cooking.

## 1. Turmeric Powder (Manjal Thool)

The golden foundation of every sambar, kootu, poriyal, and rasam. Pure turmeric provides an earthy warmth, natural golden colour, and antiseptic properties. Always choose 100% pure [HIPA Turmeric Powder](/products/turmeric-powder) free from artificial yellow dyes.

## 2. Red Chilli Powder (Milagai Thool)

South Indian cooking requires a careful balance between fiery heat and deep natural red colour. Milled from sun-dried chillies, [HIPA Red Chilli Powder](/products/red-chilli-powder) delivers clean pungency without synthetic red colour additives.

## 3. Coriander Powder (Malli Thool)

Coriander is the unsung hero of South Indian curries. Ground from dried coriander seeds, it provides body, thickness, and a cooling, citrus-scented aroma that balances fiery chillies. Explore [HIPA Coriander Powder](/products/coriander-powder) for authentic gravies.

## 4. Cumin Powder (Jeera Thool)

Essential for digestion, rasams, and everyday tempering. Cumin releases warm cuminaldehyde aromas that ground tamarind-based dishes. [HIPA Cumin Powder](/products/cumin-powder) is slow-roasted before grinding to maximise nutty depth.

## 5. Black Pepper Powder (Milagu Thool)

Before chillies arrived from the Americas, black pepper from the Western Ghats was South India's indigenous source of heat. In rasam, pongal, and chicken sukka, [HIPA Black Pepper Powder](/products/pepper-powder) delivers invigorating piperine sharpness.

## 6. Traditional Sambar Powder

The cornerstone blend of South Indian lunch menus. A harmonious combination of slow-roasted toor dal, chana dal, coriander seeds, cumin, fenugreek, and select chillies. [HIPA Sambar Powder](/products/sambar-powder) dissolves smoothly into stews without grittiness.

## 7. Aromatic Rasam Powder

Featuring a higher proportion of black pepper and roasted cumin to produce a light, restorative herbal broth. Learn how to prepare restaurant-style rasam with [HIPA Rasam Powder](/products/rasam-powder).

## 8. Royal Garam Masala

The finishing touch for festive weekend cooking: biryanis, kurmas, salnas, and mutton roasts. A regal blend of cinnamon, cloves, cardamom, nutmeg, and whole aromatics. Check [HIPA Garam Masala](/products/garam-masala) for authentic aroma.

## How to Keep Your Masala Box at Peak Freshness

- Refill your working spice box with only 2–3 weeks of spices at a time.
- Keep the bulk reserves in airtight containers in a cool, dark kitchen cupboard.
- Always use a dry spoon to avoid moisture contamination.

Browse the complete [HIPA Masala catalogue](/products) to assemble your essential kitchen spice collection.`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/essential-south-indian-spice-box-guide.webp",
    coverImageAlt: "A traditional South Indian spice box filled with colourful whole spices and ground masalas",
    status: "published",
    publishedAt: "2026-10-22T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-22T10:00:00.000Z",
    updatedAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: 230017,
    slug: "chettinad-masala-vs-garam-masala-differences",
    title: "Chettinad Masala vs Garam Masala: Flavor Profiles, Heat & Key Differences",
    description: "Compare the spicy, fennel-and-kalpasi-rich blends of Chettinad cooking with the warm, sweet, cinnamon-heavy notes of North Indian garam masala.",
    body: `Indian culinary traditions boast dozens of specialised spice blends, but two of the most famous are **Garam Masala** and **Chettinad Masala**. While both feature aromatic whole spices, their culinary purposes, roasting styles, and regional ingredient footprints could not be more distinct.

Understanding these differences will transform how you season gravies, biryanis, and roasts.

## The Origins: Imperial North vs Merchant Royalty of Tamil Nadu

- **Garam Masala:** Developed in North India and royal Mughal kitchens as a warming, non-pungent finishing blend. The Hindi word *Garam* translates to \"warm\", referencing Ayurvedic principles of warming the metabolic fire.
- **Chettinad Masala:** Born in the arid Chettinad region of Tamil Nadu, crafted by the Nattukottai Chettiars who traded exotic spices across Burma, Sri Lanka, and Southeast Asia. It is known for complex, assertive heat, toasted coconut, and rare forest spices.

## Ingredient Comparison

| Spice Component | Royal Garam Masala | Chettinad Masala |
| --- | --- | --- |
| Primary Base | Cinnamon, Clove, Green Cardamom | Coriander Seeds, Dry Red Chillies, Fennel |
| Signature Aromatics | Nutmeg, Mace, Black Cardamom | Kalpasi (Black Stone Flower), Marathi Moggu |
| Star Anise & Fennel | Used sparingly | Prominent foundational flavour |
| Whole Chillies & Pepper | Mild pepper, almost no whole chilli | High ratio of Guntur chillies & black pepper |
| Culinary Role | Finishing spice added in the final 5 minutes | Simmering gravy base cooked with the meat/vegetables |

## When to Use Garam Masala

Because [HIPA Garam Masala](/products/garam-masala) is a pure spice blend without filler powders, its sweet, warming notes bloom best when sprinkled toward the end of cooking:

- Stirred into South Indian chicken salna or vegetable kurma.
- Layered between rice and meat during the dum phase of biryani.
- Dusted over paneer butter masala, chole, or rich tomato gravies.

## When to Use Chettinad Masala

Chettinad masala is a robust, full-bodied masala that requires cooking down in oil or ghee along with onions and ginger-garlic paste:

- Authentic Chettinad Chicken Sukka or Pepper Chicken.
- Spicy mushroom or baby potato roast.
- Ennai Kathirikai (stuffed brinjal curry).

Discover how [HIPA Masala's pure spice blends](/products) bring authentic South Indian heritage into your everyday meals.`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/chettinad-masala-vs-garam-masala-differences.webp",
    coverImageAlt: "Aromatic whole spices including stone flower, cinnamon, star anise and cardamom on rustic burlap",
    status: "published",
    publishedAt: "2026-10-21T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-21T10:00:00.000Z",
    updatedAt: "2026-10-21T10:00:00.000Z",
  },
  {
    id: 230018,
    slug: "how-to-layer-spices-south-indian-biryani-salna",
    title: "How to Layer Spices for Authentic South Indian Biryani and Salna",
    description: "Learn the professional chef technique of whole spice blooming, powder simmering, and garam masala finishing for Dindigul and Ambur biryani.",
    body: `A truly memorable South Indian biryani—whether Dindigul seeraga samba style or Ambur dum style—does not get its depth by dumping all spices into the pot at once. Professional South Indian chefs use a precise, three-stage **spice layering technique** that extracts aroma, colour, and heat in harmony.

Here is the step-by-step masterclass on how to layer spices for home biryanis and authentic street-style parotta salna.

## Stage 1: Blooming Whole Spices in Hot Fat

Whole spices contain insoluble flavour precursors that dissolve only in hot fat (ghee or oil):

- Heat equal parts pure ghee and cold-pressed oil in a heavy-bottomed handi.
- When shimmering hot, add whole cinnamon bark, green cardamom pods, cloves, and star anise.
- Sizzle for 20–30 seconds until the cardamom pods puff up and the cloves release a sweet aroma. This infuses the cooking oil with fragrant base notes that coat every grain of rice later.

## Stage 2: Sautéing Onions and Simmering Ground Powders

Once onions are golden and ginger-garlic paste has lost its raw edge, it is time for the colour and body builders:

- Add [HIPA Turmeric Powder](/products/turmeric-powder) for an antiseptic golden foundation.
- Add [HIPA Red Chilli Powder](/products/red-chilli-powder) directly into the oil to extract natural fat-soluble red carotenoid pigments.
- Add [HIPA Coriander Powder](/products/coriander-powder) mixed with thick curd to create the rich masala gravy (*yakhni*).
- Simmer on medium-low heat until oil droplets separate on the surface (*roghen*).

## Stage 3: The Dum Finishing Touch with Garam Masala

The fatal mistake of amateur cooking is boiling garam masala during Stage 2. High heat destroys delicate top-note aromas of nutmeg, mace, and cardamom.

- Just before sealing the biryani handi with dough or foil for dum cooking, sprinkle 1/2 teaspoon of [HIPA Garam Masala](/products/garam-masala) over the top rice layer along with fresh chopped mint leaves, coriander, and fried shallots.
- As the handi steams, the rising vapor carries the garam masala fragrance through every layer of rice without scorching the spices.

## Making Street-Style Parotta Salna

No Chennai meal is complete without parotta paired with aromatic roadside salna:

1. Grind roasted coconut, fennel seeds, and roasted gram dal into a smooth paste.
2. In a kadai, sauté onions, green chillies, curry leaves, and tomatoes.
3. Add 1.5 teaspoons of [HIPA Sambar Powder](/products/sambar-powder) and 1/2 teaspoon of [HIPA Red Chilli Powder](/products/red-chilli-powder).
4. Pour in thin coconut milk or vegetable broth and simmer for 8 minutes.
5. Finish with a pinch of [HIPA Garam Masala](/products/garam-masala) for that unmistakable hotel aroma.

Explore HIPA Masala's [range of traditional spices and masala blends](/products) to cook like a master chef.`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/how-to-layer-spices-south-indian-biryani-salna.webp",
    coverImageAlt: "Fragrant South Indian dum biryani garnished with mint, fried onions and whole spices in a copper handi",
    status: "published",
    publishedAt: "2026-10-20T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
  },
  {
    id: 230019,
    slug: "digestive-benefits-traditional-south-indian-spices",
    title: "7 Digestive Benefits of Traditional South Indian Spices Backed by Science",
    description: "Explore the digestive and gut-health science behind cumin, black pepper, asafoetida (hing), fenugreek, and turmeric in South Indian everyday meals.",
    body: `Traditional South Indian cuisine is inherently functional. From morning idli sambar to soothing rasam சாதம் (rice) at lunch, every spice in Tamil culinary heritage was chosen not merely for taste, but for physiological digestive benefits documented across millennia of Siddha and Ayurvedic knowledge.

Modern biomedical research now confirms the bio-active compounds responsible for these traditional health claims.

## 1. Cumin (Jeera): Stimulating Digestive Enzymes

Cumin seeds contain cuminaldehyde and thymol, which stimulate salivary glands and activate pancreatic digestive enzymes. Consuming cumin-infused rasam or jeera water accelerates carbohydrate and fat breakdown in the gastrointestinal tract.

## 2. Black Pepper (Milagu): Piperine and Nutrient Bioavailability

Black pepper's signature active alkaloid is **piperine**. Research published in international nutrition journals reveals that piperine increases stomach hydrochloric acid secretion, preventing sluggish digestion and bloating. Crucially, piperine enhances the bioavailability of curcumin from turmeric by up to 2,000%.

## 3. Asafoetida (Perungayam / Hing): The Natural Anti-Flatulent

Rich in ferulic acid and organic sulphur compounds, asafoetida has powerful anti-spasmodic properties. Adding hing to lentil-heavy sambar or kootu relaxes digestive muscles and eliminates gas production during legume digestion.

## 4. Fenugreek (Vendhayam): Soluble Fibre and Gut Mucosa

Fenugreek seeds contain mucilage, a slippery soluble fibre that coats the stomach lining, shielding it from excess acid. It also slows carbohydrate absorption, supporting balanced post-meal blood sugar levels.

## 5. Turmeric (Manjal): Curcumin and Gut Microbiome

Curcumin is a potent natural anti-inflammatory agent. Daily dietary intake of pure [Turmeric Powder](/products/turmeric-powder) supports gut barrier integrity, reduces intestinal inflammation, and promotes beneficial gut bacteria (*Bifidobacteria*).

## 6. Coriander (Kothamalli / Dhania): Cooling and Spasm Relief

While chillies generate metabolic heat, coriander seeds provide linalool, an aromatic compound with cooling and carminative actions that calms intestinal spasms and balances acidic foods.

## 7. Dried Red Chilli (Milagai): Metabolism and Gastric Blood Flow

Capasaicin in natural dried chillies stimulates local blood circulation across the gastric mucosa and increases core metabolic rate without damaging healthy stomach tissue when consumed in balanced culinary amounts.

## The Quality Rule: Only Pure Spices Deliver Health Benefits

When commercial spices are adulterated with synthetic dyes or starches, their natural therapeutic value is lost. At HIPA Masala in Pallavaram, Chennai, our manufacturing philosophy is strictly centred on 100% natural, unadulterated whole spice milling.

Discover our [pure spice powders and traditional blends](/products) or learn about our [ethical manufacturing processes](/about).`,
    authorName: "HIPA Masala",
    coverImageUrl: "/assets/digestive-benefits-traditional-south-indian-spices.webp",
    coverImageAlt: "Assortment of medicinal South Indian spices including cumin, black pepper, turmeric, and fenugreek seeds",
    status: "published",
    publishedAt: "2026-10-19T10:00:00.000Z",
    createdByUserId: 1,
    createdAt: "2026-10-19T10:00:00.000Z",
    updatedAt: "2026-10-19T10:00:00.000Z",
  },
];

const allBlogs = [...newBlogs, ...originalBlogs];
fs.writeFileSync(blogPostsPath, JSON.stringify(allBlogs, null, 2), 'utf8');
console.log(`✓ Successfully updated data/blog-posts.json with ${allBlogs.length} articles!`);
