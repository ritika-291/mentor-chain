

import step1 from "../assets/images/step1.png";
import step2 from "../assets/images/step2.png";
import step3 from "../assets/images/step3.png";

const workSteps = [
  {
    step: "1",
    title: "Create your profile",
    description:
      "Our registration form helps us understand you deeply so we can match you with the right mentors.",
    buttonText: "REGISTER",
    link: "/signup",
    image: step1
  },
  {
    step: "2",
    title: "Search Mentor",
    description:
      "Use our smart search, filters, and recommendations to find the mentor who aligns with your goals.",
    buttonText: "SEARCH NOW",
    link: "/mentors",
    image: step2
  },
  {
    step: "3",
    title: "Make a connection",
    description:
      "Schedule sessions, chat, or meet virtually with someone who could change your life.",
    buttonText: "SEE TESTIMONIALS",
    link: "/",
    image: step3
  }
];

export default workSteps;
