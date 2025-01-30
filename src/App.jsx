import React from "react";
import data from "./data/schema.json";
import { useForm } from "react-hook-form";
import FormBuilder from "./components/form-builder/form-builder";

const App = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    console.log("Form Submitted Data:", formData);
  };

  return (
    <div className="m-5">
      {/* <h1>Dynamic Form</h1>
      <DynamicForm schema={data} register={register} errors={errors} />
      <Button
        className="mt-3"
        onClick={handleSubmit(onSubmit)}
        variant="primary"
      >
        Submit
      </Button> */}
      <FormBuilder />
    </div>
  );
};

export default App;
