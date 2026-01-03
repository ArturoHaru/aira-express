import test from "node:test";
import assert from "node:assert";
import { lms } from "../../services/lm-studio";

// non è uno unit test, è per lo sviluppo, quindi non ha un assert
test("collegamento con llm (non unit test)", async () => {
  // const res = await lms.getAnswer("Ciao, dimmi brevemente chi sei.");
  // console.log(res.content);
});
