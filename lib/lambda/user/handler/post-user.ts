import { PostUserUseCase } from "../usecase/post-user-usecase";

export const handler = async (event: any = {}): Promise<any> => {
  const postUserUseCase = new PostUserUseCase(event.body);

  try {
    const response = await postUserUseCase.createUser();
    return { statusCode: 200, body: JSON.stringify(response), headers: { "Access-Control-Allow-Origin": "*" } };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error), headers: { "Access-Control-Allow-Origin": "*" } };
  }
};
