import { Fragment, useEffect } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { GradeOutput, ThemeOutput } from "../types/textbausteine";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

import LoadingButton from "./common/LoadingButton";

const formValidator = z.object({
  grade1: z.string(),
  grade2: z.string(),
  grade3: z.string(),
  grade4: z.string(),
  grade5: z.string(),
  grade6: z.string(),
});

type FormValues = z.infer<typeof formValidator>;

export default function EditGradesModal({
  open,
  setOpen,
  theme,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
  theme: ThemeOutput;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formValidator),
  });

  useEffect(() => {
    if (theme.id !== "") {
      reset({
        grade1: theme.grades.filter((g) => g.grade === 1)[0].snippet,
        grade2: theme.grades.filter((g) => g.grade === 2)[0].snippet,
        grade3: theme.grades.filter((g) => g.grade === 3)[0].snippet,
        grade4: theme.grades.filter((g) => g.grade === 4)[0].snippet,
        grade5: theme.grades.filter((g) => g.grade === 5)[0].snippet,
        grade6: theme.grades.filter((g) => g.grade === 6)[0].snippet,
      });
    }
  }, [open]);

  const client = useQueryClient();

  const updateGradesMut = useMutation({
    mutationFn: async (payload: GradeOutput[]) => {
      await axios.put("http://localhost:8000/api/grade", payload);
    },
    onError: () => {
      console.error("Fehler beim Speichern der Noten");
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["theme"] });
      setOpen(false);
    },
  });

  const onSubmit = (data: FormValues) => {
    const newGrades = [...theme.grades];

    const payload = newGrades.map((grade) => {
      switch (grade.grade) {
        case 1:
          return { ...grade, snippet: data.grade1 };
        case 2:
          return { ...grade, snippet: data.grade2 };
        case 3:
          return { ...grade, snippet: data.grade3 };
        case 4:
          return { ...grade, snippet: data.grade4 };
        case 5:
          return { ...grade, snippet: data.grade5 };
        case 6:
          return { ...grade, snippet: data.grade6 };
      }
    }) as GradeOutput[];

    updateGradesMut.mutate(payload);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3">
                  Noten bearbeiten für{" "}
                  <span className="font-semibold">
                    {theme.theme} - {theme.differentiation}
                  </span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-2">
                    <div>
                      <label
                        htmlFor="grade1"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Note 1
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="grade1"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Textbaustein Note 1"
                          rows={3}
                          {...register("grade1")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.grade1?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="grade2"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Note 2
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="grade2"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Textbaustein Note 2"
                          rows={3}
                          {...register("grade2")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.grade2?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="grade3"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Note 3
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="grade3"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Textbaustein Note 3"
                          rows={3}
                          {...register("grade3")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.grade3?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="grade4"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Note 4
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="grade4"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Textbaustein Note 4"
                          rows={3}
                          {...register("grade4")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.grade4?.message as string}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="grade5"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Note 5
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="grade5"
                          className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Textbaustein Note 5"
                          rows={3}
                          {...register("grade5")}
                        />
                        {errors && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="description-error"
                          >
                            {errors.grade5?.message as string}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="grade6"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Note 6
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="grade6"
                            className="block w-full rounded-md border-0 py-1.5 px-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Textbaustein Note 6"
                            rows={3}
                            {...register("grade6")}
                          />
                          {errors && (
                            <p
                              className="mt-2 text-sm text-red-600"
                              id="description-error"
                            >
                              {errors.grade6?.message as string}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      >
                        {updateGradesMut.isLoading ? (
                          <LoadingButton />
                        ) : (
                          "Speichern"
                        )}
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpen(false)}
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
