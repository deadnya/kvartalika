import { apiClient } from "./api.config";
import type { ContactRequestData, ContactRequestResponse } from "./api/pages.api.types";

export const validateContactRequest = (data: ContactRequestData): void => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Имя обязательно");
  } else if (data.name.trim().length < 2) {
    errors.push("Имя должно содержать минимум 2 символа");
  } else if (data.name.trim().length > 100) {
    errors.push("Имя не должно превышать 100 символов");
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.push("Номер телефона обязателен");
  } else {
    const phoneDigits = data.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      errors.push("Номер телефона должен содержать минимум 10 цифр");
    } else if (phoneDigits.length > 15) {
      errors.push("Номер телефона не должен превышать 15 цифр");
    }
  }

  if (data.comment && data.comment.trim().length > 1000) {
    errors.push("Комментарий не должен превышать 1000 символов");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
};

export const submitContactRequest = async (
  data: ContactRequestData,
): Promise<ContactRequestResponse> => {
  try {
    validateContactRequest(data);

    const payload: ContactRequestData = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      comment: data.comment ? data.comment.trim() : undefined,
    };

    const response = await apiClient.post<ContactRequestResponse>(
      "/contact_request",
      payload,
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Ошибка при отправке заявки: ${error.message}`);
    }
    throw new Error("Ошибка при отправке заявки: неизвестная ошибка");
  }
};
