import React from "react";
import { Formik } from "formik";
import { MGoalDetail, RGoalDetail } from "../../models";

interface IFormData {
  onSubmit: (args: RGoalDetail) => void;
  errors?: RGoalDetail;
  onDelete: () => void;
  onUpdateStatus: () => void;
  initialValues?: RGoalDetail;
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
