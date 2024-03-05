import {
  TLegacySurvey,
  TLegacySurveyCTAQuestion,
  TLegacySurveyChoice,
  TLegacySurveyConsentQuestion,
  TLegacySurveyMultipleChoiceMultiQuestion,
  TLegacySurveyMultipleChoiceSingleQuestion,
  TLegacySurveyNPSQuestion,
  TLegacySurveyOpenTextQuestion,
  TLegacySurveyQuestion,
  TLegacySurveyRatingQuestion,
  TLegacySurveyThankYouCard,
  TLegacySurveyWelcomeCard,
} from "@formbricks/types/LegacySurvey";
import {
  TI18nString,
  TSurveyCTAQuestion,
  TSurveyChoice,
  TSurveyConsentQuestion,
  TSurveyLanguage,
  TSurveyNPSQuestion,
  TSurveyOpenTextQuestion,
  TSurveyRatingQuestion,
  TSurveyThankYouCard,
  TSurveyWelcomeCard,
} from "@formbricks/types/surveys";
import { TSurvey, TSurveyMultipleChoiceMultiQuestion, TSurveyQuestion } from "@formbricks/types/surveys";

// Helper function to create an i18nString from a regular string.
export const createI18nString = (
  text: string | TI18nString,
  languages: string[],
  targetLanguageCode?: string
): TI18nString => {
  if (typeof text === "object") {
    // It's already an i18n object, so clone it
    const i18nString: TI18nString = structuredClone(text);
    // Add new language keys with empty strings if they don't exist
    languages?.forEach((language) => {
      if (!(language in i18nString)) {
        i18nString[language] = "";
      }
    });

    // Remove language keys that are not in the languages array
    Object.keys(i18nString).forEach((key) => {
      if (key !== (targetLanguageCode ?? "default") && languages && !languages.includes(key)) {
        delete i18nString[key];
      }
    });

    return i18nString;
  } else {
    // It's a regular string, so create a new i18n object
    const i18nString: any = {
      [targetLanguageCode ?? "default"]: text as string, // Type assertion to assure TypeScript `text` is a string
    };

    // Initialize all provided languages with empty strings
    languages?.forEach((language) => {
      if (language !== (targetLanguageCode ?? "default")) {
        i18nString[language] = "";
      }
    });

    return i18nString;
  }
};

// Function to translate a choice label
export const translateChoice = (choice: any, languages: string[], targetLanguageCode?: string) => {
  // Assuming choice is a simple object and choice.label is a string.
  return {
    ...choice,
    label: createI18nString(choice.label, languages, targetLanguageCode),
  };
};
export const translateWelcomeCard = (
  welcomeCard: TSurveyWelcomeCard,
  languages: string[],
  targetLanguageCode?: string
): TSurveyWelcomeCard => {
  const clonedWelcomeCard = structuredClone(welcomeCard);
  if (welcomeCard.headline) {
    clonedWelcomeCard.headline = createI18nString(welcomeCard.headline, languages, targetLanguageCode);
  }
  if (welcomeCard.html) {
    clonedWelcomeCard.html = createI18nString(welcomeCard.html, languages, targetLanguageCode);
  }
  if (clonedWelcomeCard.buttonLabel) {
    clonedWelcomeCard.buttonLabel = createI18nString(
      clonedWelcomeCard.buttonLabel,
      languages,
      targetLanguageCode
    );
  }

  return clonedWelcomeCard;
};

export const translateThankYouCard = (
  thankYouCard: TSurveyThankYouCard,
  languages: string[],
  targetLanguageCode?: string
): TSurveyThankYouCard => {
  const clonedThankYouCard = structuredClone(thankYouCard);
  if (thankYouCard.headline) {
    clonedThankYouCard.headline = createI18nString(thankYouCard.headline, languages, targetLanguageCode);
  }
  if (thankYouCard.subheader) {
    clonedThankYouCard.subheader = createI18nString(thankYouCard.subheader, languages, targetLanguageCode);
  }
  if (thankYouCard.buttonLabel) {
    clonedThankYouCard.buttonLabel = createI18nString(
      thankYouCard.buttonLabel,
      languages,
      targetLanguageCode
    );
  }

  return clonedThankYouCard;
};

// Function that will translate a single question
export const translateQuestion = (
  question: TSurveyQuestion,
  languages: string[],
  targetLanguageCode?: string
) => {
  // Clone the question to avoid mutating the original
  const clonedQuestion = structuredClone(question);

  clonedQuestion.headline = createI18nString(question.headline, languages, targetLanguageCode);
  if (clonedQuestion.subheader) {
    clonedQuestion.subheader = createI18nString(question.subheader ?? "", languages, targetLanguageCode);
  }

  if (clonedQuestion.buttonLabel) {
    clonedQuestion.buttonLabel = createI18nString(question.buttonLabel ?? "", languages, targetLanguageCode);
  }

  if (clonedQuestion.backButtonLabel) {
    clonedQuestion.backButtonLabel = createI18nString(
      question.backButtonLabel ?? "",
      languages,
      targetLanguageCode
    );
  }

  if (question.type === "multipleChoiceSingle" || question.type === "multipleChoiceMulti") {
    (clonedQuestion as TSurveyMultipleChoiceMultiQuestion | TSurveyMultipleChoiceMultiQuestion).choices =
      question.choices.map((choice) =>
        translateChoice(structuredClone(choice), languages, targetLanguageCode)
      );
    (
      clonedQuestion as TSurveyMultipleChoiceMultiQuestion | TSurveyMultipleChoiceMultiQuestion
    ).otherOptionPlaceholder = question.otherOptionPlaceholder
      ? createI18nString(question.otherOptionPlaceholder, languages, targetLanguageCode)
      : undefined;
  }
  if (question.type === "openText") {
    if (question.placeholder) {
      (clonedQuestion as TSurveyOpenTextQuestion).placeholder = createI18nString(
        question.placeholder,
        languages,
        targetLanguageCode
      );
    }
  }
  if (question.type === "cta") {
    if (question.dismissButtonLabel) {
      (clonedQuestion as TSurveyCTAQuestion).dismissButtonLabel = createI18nString(
        question.dismissButtonLabel,
        languages,
        targetLanguageCode
      );
    }
    if (question.html) {
      (clonedQuestion as TSurveyCTAQuestion).html = createI18nString(
        question.html,
        languages,
        targetLanguageCode
      );
    }
  }
  if (question.type === "consent") {
    if (question.html) {
      (clonedQuestion as TSurveyConsentQuestion).html = createI18nString(
        question.html,
        languages,
        targetLanguageCode
      );
    }

    if (question.label) {
      (clonedQuestion as TSurveyConsentQuestion).label = createI18nString(
        question.label,
        languages,
        targetLanguageCode
      );
    }
  }
  if (question.type === "nps") {
    (clonedQuestion as TSurveyNPSQuestion).lowerLabel = createI18nString(
      question.lowerLabel ?? "",
      languages,
      targetLanguageCode
    );
    (clonedQuestion as TSurveyNPSQuestion).upperLabel = createI18nString(
      question.upperLabel ?? "",
      languages,
      targetLanguageCode
    );
  }
  if (question.type === "rating") {
    (clonedQuestion as TSurveyRatingQuestion).lowerLabel = createI18nString(
      question.lowerLabel ?? "",
      languages,
      targetLanguageCode
    );
    (clonedQuestion as TSurveyRatingQuestion).upperLabel = createI18nString(
      question.upperLabel ?? "",
      languages,
      targetLanguageCode
    );
  }
  return clonedQuestion;
};

// Function to translate an entire survey
export const translateSurvey = (
  survey: TSurvey,
  surveyLanguages: TSurveyLanguage[],
  targetLanguageCode?: string
): TSurvey => {
  const languages = extractLanguageCodes(surveyLanguages);

  const translatedQuestions = survey.questions.map((question) => {
    return translateQuestion(question, languages, targetLanguageCode);
  });
  const translatedWelcomeCard = translateWelcomeCard(survey.welcomeCard, languages, targetLanguageCode);
  const translatedThankYouCard = translateThankYouCard(survey.thankYouCard, languages, targetLanguageCode);
  const translatedSurvey = structuredClone(survey);
  return {
    ...translatedSurvey,
    questions: translatedQuestions,
    welcomeCard: translatedWelcomeCard,
    thankYouCard: translatedThankYouCard,
  };
};

export const isLabelValidForAllLanguages = (label: TI18nString, languages: string[]): boolean => {
  return languages.every((language) => label[language] && label[language].trim() !== "");
};

export const isSurveyAvailableInSelectedLanguage = (languageSymbol: string, survey: TSurvey) => {
  if (survey.questions[0].headline[languageSymbol]) {
    return true;
  }
  return false;
};

export const getLocalizedValue = (value: TI18nString | undefined, languageId: string): string => {
  if (!value) {
    return "";
  }
  if (isI18nString(value)) {
    if (value[languageId]) {
      return value[languageId];
    }
    return "";
  }
  return "";
};

function isI18nString(object: any): object is TI18nString {
  return typeof object === "object";
}

export const extractLanguageCodes = (surveyLanguages: TSurveyLanguage[]): string[] => {
  if (!surveyLanguages) return [];
  return surveyLanguages.map((surveyLanguage) =>
    surveyLanguage.default ? "default" : surveyLanguage.language.code
  );
};

// Helper function to extract a regular string from an i18nString.
const extractStringFromI18n = (i18nString: TI18nString, languageCode: string): string => {
  if (typeof i18nString === "object" && i18nString !== null) {
    return i18nString[languageCode] || "";
  }
  return i18nString;
};

// Function to reverse translate a choice
const reverseTranslateChoice = (choice: TSurveyChoice, languageCode: string): TLegacySurveyChoice => {
  return {
    ...choice,
    label: extractStringFromI18n(choice.label, languageCode),
  };
};

// Function to reverse translate a question of any type
const reverseTranslateQuestion = (question: TSurveyQuestion, languageCode: string): TLegacySurveyQuestion => {
  const clonedQuestion = structuredClone(question) as unknown as TLegacySurveyQuestion;
  clonedQuestion.headline = extractStringFromI18n(question.headline, languageCode);

  if (clonedQuestion.subheader) {
    if (question.subheader) {
      clonedQuestion.subheader = extractStringFromI18n(question.subheader, languageCode);
    }
  }

  if (clonedQuestion.buttonLabel) {
    if (question.buttonLabel) {
      clonedQuestion.buttonLabel = extractStringFromI18n(question.buttonLabel, languageCode);
    }
  }

  if (clonedQuestion.backButtonLabel) {
    if (question.backButtonLabel) {
      clonedQuestion.backButtonLabel = extractStringFromI18n(question.backButtonLabel, languageCode);
    }
  }

  // Handle question type-specific fields
  switch (question.type) {
    case "multipleChoiceSingle":
    case "multipleChoiceMulti":
      (
        clonedQuestion as TLegacySurveyMultipleChoiceMultiQuestion | TLegacySurveyMultipleChoiceSingleQuestion
      ).choices = question.choices.map((choice) => reverseTranslateChoice(choice, languageCode));
      if (question.otherOptionPlaceholder) {
        (
          clonedQuestion as
            | TLegacySurveyMultipleChoiceMultiQuestion
            | TLegacySurveyMultipleChoiceSingleQuestion
        ).otherOptionPlaceholder = extractStringFromI18n(question.otherOptionPlaceholder, languageCode);
      }
      break;
    case "openText":
      if (question.placeholder) {
        (clonedQuestion as TLegacySurveyOpenTextQuestion).placeholder = extractStringFromI18n(
          question.placeholder,
          languageCode
        );
      }
      break;
    case "nps":
      (clonedQuestion as TLegacySurveyNPSQuestion).lowerLabel = extractStringFromI18n(
        question.lowerLabel,
        languageCode
      );
      (clonedQuestion as TLegacySurveyNPSQuestion).upperLabel = extractStringFromI18n(
        question.upperLabel,
        languageCode
      );
      break;
    case "rating":
      (clonedQuestion as TLegacySurveyRatingQuestion).lowerLabel = extractStringFromI18n(
        question.lowerLabel,
        languageCode
      );
      (clonedQuestion as TLegacySurveyRatingQuestion).upperLabel = extractStringFromI18n(
        question.upperLabel,
        languageCode
      );
      break;
    case "cta":
      if (question.dismissButtonLabel) {
        (clonedQuestion as TLegacySurveyCTAQuestion).dismissButtonLabel = extractStringFromI18n(
          question.dismissButtonLabel,
          languageCode
        );
      }
      if (question.html) {
        (clonedQuestion as TLegacySurveyCTAQuestion).html = extractStringFromI18n(
          question.html,
          languageCode
        );
      }
      break;
    case "consent":
      if (question.html) {
        (clonedQuestion as TLegacySurveyConsentQuestion).html = extractStringFromI18n(
          question.html,
          languageCode
        );
      }
      if (question.label) {
        (clonedQuestion as TLegacySurveyConsentQuestion).label = extractStringFromI18n(
          question.label,
          languageCode
        );
      }
      break;
  }

  return clonedQuestion;
};

// Function to reverse translate a welcome card
const reverseTranslateWelcomeCard = (
  welcomeCard: TSurveyWelcomeCard,
  languageCode: string
): TLegacySurveyWelcomeCard => {
  const clonedWelcomeCard = structuredClone(welcomeCard) as unknown as TLegacySurveyWelcomeCard;
  clonedWelcomeCard.headline = extractStringFromI18n(welcomeCard.headline, languageCode);
  if (welcomeCard.html) {
    clonedWelcomeCard.html = extractStringFromI18n(welcomeCard.html, languageCode);
  }
  if (welcomeCard.buttonLabel) {
    clonedWelcomeCard.buttonLabel = extractStringFromI18n(welcomeCard.buttonLabel, languageCode);
  }

  return clonedWelcomeCard;
};

// Function to reverse translate a thank you card
const reverseTranslateThankYouCard = (
  thankYouCard: TSurveyThankYouCard,
  languageCode: string
): TLegacySurveyThankYouCard => {
  const clonedThankYouCard = structuredClone(thankYouCard) as unknown as TLegacySurveyThankYouCard;
  if (thankYouCard.headline) {
    clonedThankYouCard.headline = extractStringFromI18n(thankYouCard.headline, languageCode);
  }
  if (thankYouCard.subheader) {
    clonedThankYouCard.subheader = extractStringFromI18n(thankYouCard.subheader, languageCode);
  }
  if (thankYouCard.buttonLabel) {
    clonedThankYouCard.buttonLabel = extractStringFromI18n(thankYouCard.buttonLabel, languageCode);
  }

  return clonedThankYouCard;
};

// Function to reverse translate an entire survey
export const reverseTranslateSurvey = (survey: TSurvey, languageCode?: string): TLegacySurvey => {
  const targetLanguageCode = languageCode ?? "default";
  const reversedQuestions = survey.questions.map((question) =>
    reverseTranslateQuestion(question, targetLanguageCode)
  );

  const reversedWelcomeCard = reverseTranslateWelcomeCard(survey.welcomeCard, targetLanguageCode);
  const reversedThankYouCard = reverseTranslateThankYouCard(survey.thankYouCard, targetLanguageCode);

  const reversedSurvey = structuredClone(survey) as unknown as TLegacySurvey;
  reversedSurvey.questions = reversedQuestions;
  reversedSurvey.welcomeCard = reversedWelcomeCard;
  reversedSurvey.thankYouCard = reversedThankYouCard;

  return reversedSurvey;
};