import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
