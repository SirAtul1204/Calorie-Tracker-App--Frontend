import axios from "axios";
import { token, URL } from "../Constants";

export class Service {
  static async auth(): Promise<any> {
    const response = await axios.get(`${URL}/user/verify`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        token,
      },
    });
    // console.log(response);
    return response;
  }

  static async getFoods(page: number): Promise<any> {
    try {
      const response = await axios.get(`${URL}/food`, {
        headers: {
          "Content-Type": "application/json",
          jwt: token,
        },
        params: {
          page,
        },
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  }

  static async addFood({
    name,
    date,
    calorie,
    userId,
  }: {
    name: string;
    date: string;
    calorie: number;
    userId?: string;
  }): Promise<any> {
    const response = await axios.post(
      `${URL}/food`,
      userId
        ? {
            name: name.split("--")[0],
            date,
            calorie,
            userId,
          }
        : {
            name: name.split("--")[0],
            date,
            calorie,
          },
      {
        headers: {
          "Content-Type": "application/json",
          jwt: token,
        },
      }
    );
    console.log(response);
  }

  static async removeFood(foodId: number): Promise<any> {
    await axios.delete(`${URL}/food/${foodId}`, {
      headers: {
        "Content-Type": "application/json",
        jwt: token,
      },
    });
  }

  static async updateFood({
    foodId,
    name,
    calorie,
    date,
  }: {
    foodId: number;
    name: string;
    calorie: number;
    date: string;
  }): Promise<any> {
    const response = await axios.put(
      `${URL}/food/${foodId}`,
      {
        name,
        calorie,
        date,
      },
      {
        headers: {
          "Content-Type": "application/json",
          jwt: token,
        },
      }
    );
    console.log(response);
  }

  static async inviteFriend({
    name,
    email,
  }: {
    name: string;
    email: string;
  }): Promise<any> {
    const response = await axios.post(
      `${URL}/user/invite`,
      {
        name,
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
          jwt: token,
        },
      }
    );

    console.log(response.data);
    return response.data;
  }

  static async getReport() {
    const response = await axios.get(`${URL}/food/report`, {
      headers: {
        "Content-Type": "application/json",
        jwt: token,
      },
    });
    console.log(response);
    return response.data;
  }
}
