import InputField from "../../LoginCom/InputField";

export default function MenteeFields() {
  return (
    <>
      <InputField label="Full Name" type="text" />
      <InputField label="Current Role / Student" type="text" />
      <InputField label="Field of Interest" type="text" />
      <InputField label="Learning Goals" type="textarea" />
    </>
  );
}
