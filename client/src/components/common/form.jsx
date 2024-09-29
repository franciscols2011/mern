// CommonForm.jsx

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
	FaCheckCircle,
	FaTimesCircle,
	FaUser,
	FaEnvelope,
	FaLock,
} from "react-icons/fa";

function CommonForm({
	formControls,
	formData,
	setFormData,
	onSubmit,
	buttonText,
	onChange,
	showErrors = true, // Nueva prop para controlar la visualización de errores
}) {
	const [errors, setErrors] = useState({});
	const [validFields, setValidFields] = useState({});
	const [touchedFields, setTouchedFields] = useState({});

	function validateField(name, value) {
		let error = "";
		let isValid = false;

		switch (name) {
			case "userName":
				isValid =
					value.trim() !== "" && value.length >= 3 && value.length <= 12;
				if (!isValid) error = "Username must be between 3 and 12 characters";
				break;

			case "email":
				isValid = validateEmail(value);
				if (!isValid) error = "Invalid email format";
				break;

			case "confirmEmail":
				isValid = value === formData.email;
				if (!isValid) error = "Emails do not match";
				break;

			case "password":
				isValid = value.length >= 8 && value.length <= 15;
				if (!isValid) error = "Password must be between 8 and 15 characters";
				break;

			case "confirmPassword":
				isValid = value === formData.password;
				if (!isValid) error = "Passwords do not match";
				break;

			default:
				isValid = value.trim() !== "";
				if (!isValid) error = "This field is required";
		}

		setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
		setValidFields((prevValidFields) => ({
			...prevValidFields,
			[name]: isValid,
		}));

		return isValid;
	}

	function validateEmail(email) {
		const re = /\S+@\S+\.\S+/;
		return re.test(email);
	}

	function handleChange(event) {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});

		setTouchedFields((prevTouched) => ({
			...prevTouched,
			[name]: true,
		}));

		if (showErrors) {
			validateField(name, value);
		}

		if (onChange) {
			onChange(event);
		}
	}

	function handleBlur(event) {
		if (showErrors) {
			const { name, value } = event.target;
			validateField(name, value);
		}
	}

	function renderInputsByComponentType(getControlItem) {
		let element = null;
		const value = formData[getControlItem.name] || "";
		const error = errors[getControlItem.name];
		const isValid = validFields[getControlItem.name];
		const isTouched = touchedFields[getControlItem.name];

		const commonProps = {
			name: getControlItem.name,
			placeholder: getControlItem.placeholder,
			id: getControlItem.name,
			value: value,
			onChange: handleChange,
			onBlur: handleBlur,
		};

		let icon;
		switch (getControlItem.name) {
			case "userName":
			case "identifier":
				icon = <FaUser className="text-gray-400" />;
				break;
			case "email":
			case "confirmEmail":
				icon = <FaEnvelope className="text-gray-400" />;
				break;
			case "password":
			case "confirmPassword":
				icon = <FaLock className="text-gray-400" />;
				break;
			default:
				icon = null;
		}

		const borderColor =
			showErrors && error && isTouched ? "border-red-500" : "border-gray-300";

		element = (
			<div className="relative">
				{icon && <div className="absolute left-3 top-3">{icon}</div>}
				<Input
					type={getControlItem.type}
					{...commonProps}
					className={`w-full ${
						icon ? "pl-10" : ""
					} pr-10 py-2 text-gray-800 placeholder-gray-400 bg-white border ${borderColor} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
				/>
				{showErrors && isValid && !error && isTouched && (
					<FaCheckCircle className="text-green-500 absolute right-3 top-3" />
				)}
				{showErrors && !isValid && error && isTouched && (
					<FaTimesCircle className="text-red-500 absolute right-3 top-3" />
				)}
			</div>
		);

		return (
			<div className="flex flex-col gap-1">
				<Label className="mb-1 text-gray-700">{getControlItem.label}</Label>
				{element}
				{showErrors && error && isTouched && (
					<p className="text-red-500 text-xs mt-1">{error}</p>
				)}
			</div>
		);
	}

	const isFormValid = showErrors
		? formControls.every((control) => validFields[control.name])
		: true;

	return (
		<form onSubmit={onSubmit}>
			<div className="flex flex-col gap-5">
				{formControls.map((controlItem) => (
					<div key={controlItem.name}>
						{renderInputsByComponentType(controlItem)}
					</div>
				))}
			</div>
			<Button
				disabled={!isFormValid}
				type="submit"
				className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
			>
				{buttonText || "Submit"}
			</Button>
		</form>
	);
}

export default CommonForm;
