import type { Medicine } from "./types";
import productImage from "../../images/create-shop-mobile.jpg";

export const mockMedicine: Medicine = {
  id: "1",
  name: "Moringa",
  supplier: "Brand: Panfing Graphene",
  price: "৳470",
  image: productImage,
  description: [
    {
      text: "Although it's typically considered safe, excessive consumption can lead to side effects. Therefore, it's recommended to consult a healthcare professional before using moringa, especially if you're pregnant, nursing, or taking other medications. This balanced approach allows for the benefits of moringa while recognizing the importance of proper usage and caution.",
    },
    {
      title: "Medicinal Uses: Antioxidant Properties:",
      text: "Moringa is packed with antioxidants that help fight oxidative stress and inflammation in the body.",
    },
    {
      title: "Anti-Diabetic Effects:",
      text: "Some studies have shown that moringa leaves might lower blood sugar levels, making it a valuable supplement for managing diabetes.",
    },
    {
      title: "Heart Health:",
      text: "The plant has been linked to reduced cholesterol levels, which is vital for heart health.",
    },
    {
      title: "Anti-Cancer Properties:",
      text: "Certain compounds in moringa, such as niazimicin, have been found to suppress the growth of cancer cells in laboratory studies.",
    },
    {
      title: "Immune Support:",
      text: "With its high vitamin C content, moringa can boost the immune system.",
    },
    {
      title: "Digestive Aid:",
      text: "Moringa can help in treating digestive disorders due to its anti-inflammatory properties.",
    },
  ],
  reviews: [
    {
      id: "r1",
      author: "Leroy Jenkins",
      date: "2 days ago",
      text: "I've been using Moringa powder in my smoothies for a few weeks now. My energy levels are up, and I feel great. I followed the recommended dosage, and it seems to be a perfect addition to my daily routine. Highly recommend!",
    },
    {
      id: "r2",
      author: "Leroy Jenkins",
      date: "2 days ago",
      text: "I tried Moringa capsules as part of my wellness regimen, and I've been pleasantly surprised by the results. My skin looks healthier, and I've noticed an improvement in my digestion. A natural and effective supplement!",
    },
    {
      id: "r3",
      author: "Leroy Jenkins",
      date: "2 days ago",
      text: "I added Moringa oil to my skincare routine, and the results are amazing. My skin feels smoother and more nourished. I was skeptical at first, but now I'm a firm believer in its benefits.",
    },
    {
      id: "r4",
      author: "Tom Brown",
      date: "5 days ago",
      text: "Solid supplement. Noticed better digestion after two weeks of use.",
    },
    {
      id: "r5",
      author: "Emily Chen",
      date: "1 week ago",
      text: "Average experience. Works fine, but I expected a stronger effect.",
    },
    {
      id: "r6",
      author: "David Kim",
      date: "1 week ago",
      text: "Great value for money. My doctor recommended moringa and this brand is reliable.",
    },
    {
      id: "r7",
      author: "Sophie Martin",
      date: "2 weeks ago",
      text: "I mix it into smoothies. Easy to use and no weird aftertaste for me.",
    },
    {
      id: "r8",
      author: "Chris Evans",
      date: "2 weeks ago",
      text: "Took a while to notice results, but skin and energy improved.",
    },
    {
      id: "r9",
      author: "Olivia White",
      date: "3 weeks ago",
      text: "Would love a larger pack. Quality is excellent.",
    },
    {
      id: "r10",
      author: "Noah Harris",
      date: "1 month ago",
      text: "Decent product. Shipping was slower than expected.",
    },
    {
      id: "r11",
      author: "Ava Brooks",
      date: "1 month ago",
      text: "My favorite daily supplement so far this year.",
    },
    {
      id: "r12",
      author: "Liam Foster",
      date: "2 months ago",
      text: "Clean ingredients list. Happy with the purchase.",
    },
  ],
};
