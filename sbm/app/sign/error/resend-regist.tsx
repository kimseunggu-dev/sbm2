"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { resendResetPassword } from "../sign.action";

type Props = {
	email: string;
	emailcheck: string;
};

export default function ResendRegist({ email, emailcheck }: Props) {
	const [validError, sendResetMail, isPending] = useActionState(
		resendResetPassword,
		undefined,
	);

	const send = (formData: FormData) => {
		formData.set("email", email);
		formData.set("emailcheck", emailcheck);

		sendResetMail(formData);
	};

	return (
		<form action={send}>
			<Button type="submit" variant={"primary"} disabled={isPending}>
				Resend email to <b>{email}</b>
			</Button>
			{validError && (
				<div className="text-red-500">
					{validError.email?.errors[0] || validError.emailcheck?.errors[0]}
				</div>
			)}
		</form>
	);
}
