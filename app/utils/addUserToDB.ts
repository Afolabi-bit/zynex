import getSessionUser from "@/lib/auth";
import prisma from "./db";

async function addUserToDB() {
  const user = await getSessionUser();
  if (!user) return;

  await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      name: `${user.family_name} ${user.given_name}`,
      email: user.email || "",
    },
  });
}

export default addUserToDB;
