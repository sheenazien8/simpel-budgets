import React from "react";
import { Formik } from "formik";
import { MGoal, RGoal } from "../../models";

interface IFormData {
  onSubmit: (args: RGoal) => void;
  errors?: RGoal;
  onDelete: () => void;
  onUpdateStatus: () => void;
  initialValues?: RGoal;
}

const FormData = (props: IFormData) => {

  return (
    <Formik
      initialValues={props.initialValues ?? {}}
      onSubmit={props.onSubmit}
    >
      {(formik) => (
        <form className="space-y-4" onSubmit={formik.handleSubmit} autoComplete="off">
        </form>
      )}
    </Formik>
  );
};

export default FormData;
