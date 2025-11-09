import { apiClient } from "./api.config";
import type { FindRequestData, FindRequestResponse } from "./api/pages.api.types";

export const validateFindRequest = (data: FindRequestData): void => {
  const errors: string[] = [];

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push("Имя обязательно");
  } else if (data.firstName.trim().length < 2) {
    errors.push("Имя должно содержать минимум 2 символа");
  } else if (data.firstName.trim().length > 100) {
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

  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Некорректный адрес электронной почты");
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
};

export const submitFindRequest = async (
  data: FindRequestData,
): Promise<FindRequestResponse> => {
  try {
    validateFindRequest(data);

    const payload: FindRequestData = {
      lastName: data.lastName.trim(),
      firstName: data.firstName.trim(),
      patronymic: data.patronymic.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
    };

    const response = await apiClient.post<FindRequestResponse>(
      "/find_request",
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
