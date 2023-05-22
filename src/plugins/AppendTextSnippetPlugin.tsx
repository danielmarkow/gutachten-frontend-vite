import { Fragment } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, COMMAND_PRIORITY_LOW } from "lexical";
import type { LexicalCommand } from "lexical";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

import axios from "axios";
import { useQuery } from "react-query";

import type { ThemeOutput } from "../types/textbausteine";

import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import Loading from "../components/common/Loading";

export function AppendTextSnippedPlugin() {
  const [editor] = useLexicalComposerContext();
  const APPEND_TEXT_SNIPPET_COMMAND: LexicalCommand<string> = createCommand();

  editor.registerCommand(
    APPEND_TEXT_SNIPPET_COMMAND,
    (payload: string) => {
      editor.update(() => {
        const root = $getRoot();
        const paragraphNode = $createParagraphNode();
        const textNode = $createTextNode(payload);
        paragraphNode.append(textNode);
        root.append(paragraphNode);
      });
      return true;
    },
    COMMAND_PRIORITY_LOW
  );

  const themeQuery = useQuery({
    queryKey: ["theme"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:8000/api/theme");
      return res.data as ThemeOutput[];
    },
  });

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  if (themeQuery.isLoading) return <Loading />;

  return (
    <>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
      >
        {themeQuery.isSuccess &&
          themeQuery.data.map((theme) => (
            <>
              <li
                key={theme.id}
                className="col-span-1 flex rounded-md shadow-sm"
              >
                <div
                  className="flex w-3 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                  style={{
                    backgroundColor: `${
                      theme.color !== undefined ? theme.color : "red"
                    }`,
                  }}
                ></div>
                <div className="flex flex-1 items-center justify-between rounded-r-md border-b border-r border-t border-gray-200 bg-white w-52">
                  <div className="flex-1 px-4 py-2 text-sm">
                    <p className="font-medium text-gray-900 hover:text-gray-600">
                      {theme.theme}
                    </p>
                    <p className="text-gray-500">{theme.differentiation}</p>
                  </div>
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="nline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <EllipsisVerticalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {theme.grades.map((grade) => (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  onClick={() =>
                                    editor.dispatchCommand(
                                      APPEND_TEXT_SNIPPET_COMMAND,
                                      grade.snippet
                                    )
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  Note {grade.grade}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            </>
          ))}
      </ul>
    </>
  );
}
