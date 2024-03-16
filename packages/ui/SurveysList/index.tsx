"use client";

import TemplateBG from "@/images/assets/template_bg.png";
import { Ellipsis, Equal, MenuSquareIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@formbricks/lib/cn";
import { TEnvironment } from "@formbricks/types/environment";
import { TSurvey } from "@formbricks/types/surveys";

// import {  synchroworkTemplate } from "apps/web/app/(app)/environments/[environmentId]/surveys/templates/templates.ts";
// packages/ui/SurveysList/index.tsx
import { synchroworkTemplate } from "../../../apps/web/app/(app)/environments/[environmentId]/surveys/templates/templates";
import { replacePresetPlaceholders } from "../../../apps/web/app/lib/templates.js";
import { Input } from "../Input";
import { Button } from "../v2/Button";
import SurveyCard from "./components/SurveyCard";
import SurveyFilters from "./components/SurveyFilters";

interface SurveysListProps {
  environment: TEnvironment;
  surveys: TSurvey[];
  otherEnvironment: TEnvironment;
  isViewer: boolean;
  WEBAPP_URL: string;
  userId: string;
}

export default function SurveysList({
  environment,
  surveys,
  otherEnvironment,
  isViewer,
  WEBAPP_URL,
  userId,
}: SurveysListProps) {
  const [filteredSurveys, setFilteredSurveys] = useState<TSurvey[]>(surveys);
  // Initialize orientation state with a function that checks if window is defined
  const [orientation, setOrientation] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem("surveyOrientation") || "grid" : "grid"
  );
  const [mode, setMode] = useState<string>("Recent Items");

  // Save orientation to localStorage
  useEffect(() => {
    localStorage.setItem("surveyOrientation", orientation);
  }, [orientation]);

  const surveyStatusLabel = (s: string) => {
    if (s === "inProgress") return "Active";
    else if (s === "completed") return "Completed";
    else if (s === "draft") return "Draft";
    else if (s === "paused") return "Paused";
  };

  return (
    <div className="space-y-4">
      {/* <div className="flex justify-between">
        <h1 className="my-2 text-3xl font-bold text-slate-800">Surveys</h1>
        <Button
          href={`/environments/${environment.id}/surveys/templates`}
          variant="darkCTA"
          EndIcon={PlusIcon}>
          New survey
        </Button>
      </div> */}
      <SurveyFilters
        surveys={surveys}
        setFilteredSurveys={setFilteredSurveys}
        orientation={orientation}
        setOrientation={setOrientation}
        userId={userId}
        mode={mode}
        setMode={setMode}
      />

      {filteredSurveys.length > 0 ? (
        <div>
          {orientation === "list" && (
            <div className="flex-col space-y-3">
              <div className="mt-6 grid w-full grid-cols-8 place-items-center gap-3 px-6 text-sm text-slate-800">
                <div className="col-span-4 place-self-start">Name</div>
                <div className="col-span-4 grid w-full grid-cols-5 place-items-center">
                  <div className="col-span-2">Created at</div>
                  <div className="col-span-2">Updated at</div>
                </div>
              </div>
              {filteredSurveys.map((survey) => {
                return (
                  <SurveyCard
                    key={survey.id}
                    survey={survey}
                    environment={environment}
                    otherEnvironment={otherEnvironment}
                    isViewer={isViewer}
                    WEBAPP_URL={WEBAPP_URL}
                    orientation={orientation}
                  />
                );
              })}
            </div>
          )}
          {mode === "Recent Items" && (
            <div className="container grid grid-cols-4 gap-x-4 ">
              {filteredSurveys.map((survey) => {
                return (
                  <SurveyCard
                    key={survey.id}
                    survey={survey}
                    environment={environment}
                    otherEnvironment={otherEnvironment}
                    isViewer={isViewer}
                    WEBAPP_URL={WEBAPP_URL}
                    orientation={orientation}
                  />
                );
              })}
            </div>
          )}
          {mode === "Templates" && (
            <div className="container grid grid-cols-4 gap-x-4 ">
              {synchroworkTemplate.map((item, index) => (
                <div
                  className="cursor-pointer rounded-lg border  p-4"
                  //  onClick={() => {
                  //    const newTemplate = replacePresetPlaceholders(item, product);
                  //    onTemplateClick(newTemplate);
                  //    setActiveTemplate(newTemplate);
                  //  }}
                  key={item.name}>
                  <div className="container mx-auto mb-4 rounded-lg border bg-[#EFF6FF]">
                    <Image src={TemplateBG} alt="template" className="w-[100%]" />
                  </div>
                  <h1 className="mb-3 text-[14px] font-bold text-[#343B46]">{item.name}</h1>
                  <h2 className="text-[14px] font-normal text-[#677990]">{item.description}</h2>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <span className="mb-4 h-24 w-24 rounded-full bg-slate-100 p-6 text-5xl">🕵️</span>

          <div className="text-slate-600">No surveys found</div>
        </div>
      )}
    </div>
  );
}
