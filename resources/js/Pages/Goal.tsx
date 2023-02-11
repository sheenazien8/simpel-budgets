import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { PlusIcon } from "@heroicons/react/20/solid";
import CardList from "../Components/List";
import Modal from "../Components/Modal";
import { useGoalAction } from "../actions";
import { MGoal, RGoal } from "../models";
import {
  classNames,
  formatMoney,
  toastProgress,
  useHashRouteToggle,
} from "../utils/helper";
import { EmptyState } from "../Components/EmptyState";
import FormData from "./../Components/Goal/FormData";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Inertia } from "@inertiajs/inertia";
import Button from "../Components/Button";

interface IGoal {}

const List = () => {
  const { get, create } = useGoalAction();
  const [goals, setGoals] = useState<MGoal[]>();
  const [updated, setUpdated] = useState<boolean>(false);

  const [errors, setErrors] = useState<RGoal>();
  const [isOpen, toggleActive] = useHashRouteToggle("#opened-modal");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const onSubmit = async (values: RGoal) => {
    setLoadingSubmit(true);
    toastProgress(
      create(values, setErrors),
      `Pembuatan target ${values.title} berhasil`,
      () => {
        toggleActive(false);
        setUpdated(!updated);
        setLoadingSubmit(false);
      },
      () => setLoadingSubmit(false),
    );
  };

  const load = () => {
    setLoading(true);
    get().then((goals) => {
      setGoals(goals.data.data);
      setLoading(false);
    });
    toggleActive(false);
  };

  useEffect(() => {
    load();
  }, [updated]);

  const Results = (
    <>
      {goals?.length == 0 && (
        <EmptyState
          title="Data tujuan kosong"
          description="Rencanakan anggaran tujuan anda di tujuan tertentu"
          button={
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={() => {
                  toggleActive(true);
                }}
              >
                <PlusIcon className="h-5" /> Tambah Tujuan
              </Button>
            </div>
          }
        />
      )}
      {goals?.map((goal, index) => (
        <CardList
          bgColor={
            Number(goal.status) == 1
              ? "bg-green-600"
              : Number(goal.over_target_date) == 1
              ? "bg-red-600"
              : "bg-yellow-600"
          }
          key={index}
          title={goal.title}
          icon={
            Number(goal.status) == 1 ? (
              <CheckCircleIcon className="w-6" />
            ) : Number(goal.over_target_date) == 1 ? (
              <XCircleIcon className="w-6" />
            ) : (
              <ClockIcon className="w-6" />
            )
          }
          details={[
            goal.description ?? "-",
            <p className="italic">
              <span>{goal.start_date}</span> s/d{" "}
              <span
                className={classNames(
                  Number(goal.over_target_date) == 1 && !Number(goal.status)
                    ? "text-red-600"
                    : "",
                )}
              >
                {goal.target_date}
              </span>
            </p>,
          ]}
          onClick={async () => {
            Inertia.visit(`/goals/${goal.id}/details`);
          }}
        />
      ))}
    </>
  );

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-medium text-gray-500"></h2>
          <Button
            type="button"
            onClick={() => {
              toggleActive(true);
            }}
          >
            <PlusIcon className="h-5" />
          </Button>
        </div>
        <ul
          role="list"
          className={classNames(
            "mt-3 grid grid-cols-1 content-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 h-[550px] overflow-x-scroll",
          )}
        >
          {!loading ? (
            Results
          ) : (
            <h2 className="text-center my-auto">Loading...</h2>
          )}
        </ul>
      </div>
      <Modal
        open={isOpen}
        setOpen={(status) => {
          toggleActive(status);
          setErrors(undefined);
        }}
        title="Tambah Tujuan"
      >
        <FormData
          onSubmit={onSubmit}
          errors={errors}
          initialValues={{
            reminder_per: "dayly",
            reminder_day: "",
            reminder_time: "2023-03-29 21:00:00",
          }}
          loadingSubmit={loadingSubmit}
        />
      </Modal>
    </>
  );
};

const Goal = (props: IGoal) => {
  return (
    <Layout
      title="Tujuan"
      description="Catat tujuanmu di sini untuk memberikan semangat menabungmu"
    >
      <List {...props} />
    </Layout>
  );
};

export default Goal;
