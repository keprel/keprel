import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
}

let _client: Anthropic | undefined;
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    if (!_client) {
      _client = getClient();
    }
    const val = (_client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") {
      return val.bind(_client);
    }
    return val;
  },
});
