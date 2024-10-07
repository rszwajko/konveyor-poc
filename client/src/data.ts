import { ContextItem } from "./continue";

export const contextSource: Record<string, ContextItem[]> = {
  "ee-to-quarkus-00000": [
    {
      name: "example_01",
      description: "Solved incident no 1",
      content: `
Example with conversion to "@ApplicationScoped":
git diff\n
  \`\`\`
diff --git a/my/package/Bar.java b/my/package/Bar.java
index 072d9fc..f59742e 100644
--- a/my/package/Bar.java
+++ b/my/package/Bar.java
package my.package;
- import javax.ejb.Stateless;
+ import jakarta.enterprise.context.ApplicationScoped;

- @Stateless
+ @ApplicationScoped
public class Bar {
\`\`\`
`,
    },
  ],
};

export const msgToCode: Record<string, string> = {
  ['Stateless EJBs can be converted to a CDI bean by replacing the "@Stateless" annotation with a scope eg "@ApplicationScoped"']:
    "ee-to-quarkus-00000",
};
