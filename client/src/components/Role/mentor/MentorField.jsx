import InputField from "../../LoginCom/InputField";

export default function MentorFields() {
  return (
    <>
      <InputField label="Full Name" type="text" />
      <InputField label="Expertise (e.g., React, Design)" type="text" />
      <InputField label="Years of Experience" type="number" />
      <InputField label="LinkedIn / Portfolio URL" type="url" />
      <InputField label="Short Bio" type="textarea" />
    </>
  );
}
