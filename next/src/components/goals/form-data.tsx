import React from "react";
import { Formik } from "formik";
import { RGoal } from "@/models";
import { Button, Price, Text } from "@/ui";

interface IFormData {
  onSubmit: (args: RGoal) => void;
  errors?: RGoal;
  initialValues?: RGoal;
  loadingSubmit: boolean;
}

const FormData = (props: IFormData) => {
  return (
    <Formik initialValues={props.initialValues ?? {}} onSubmit={props.onSubmit}>
      {(formik) => (
        <form
          className="space-y-4"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <Text
            label="Judul"
            formik={formik}
            name="title"
            value={formik.values.title}
            errors={props.errors?.title}
          />
          <Text
            type="date"
            label="Tanggal Target"
            formik={formik}
            name="target_date"
            value={formik.values.target_date}
            errors={props.errors?.target_date}
          />
          <Price
            label="Nominal Target"
            formik={formik}
            name="nominal_target"
            value={formik.values.nominal_target}
            errors={props.errors?.nominal_target}
            currency="Rp"
          />
          <Text
            type="hidden"
            label="Reminder per"
            formik={formik}
            name="reminder_per"
            value={formik.values.reminder_per}
            errors={props.errors?.reminder_per}
          />
          <Text
            type="hidden"
            label="Reminder day"
            formik={formik}
            name="reminder_day"
            value={formik.values.reminder_day}
            errors={props.errors?.reminder_day}
          />
          <Text
            type="hidden"
            label="Reminder time"
            formik={formik}
            name="reminder_time"
            value={formik.values.reminder_time}
            errors={props.errors?.reminder_time}
          />
          <div className="grid grid-cols-1 gap-y-2">
            <Button loading={props.loadingSubmit} type="submit" block>
              Simpan
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default FormData;

