import { redirect } from "next/navigation"

// A V2 virou /advertising — o link antigo continua funcionando.
export default function CredencialV2Page() {
  redirect("/advertising")
}
