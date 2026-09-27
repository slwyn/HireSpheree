import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import Footer from "../Footer";
import { supabase } from "../Services/supabaseClient";

const Contact = () => {
	const { control, handleSubmit, reset, formState: { errors } } = useForm();
	const [submitted, setSubmitted] = useState(false);
	const [sending, setSending] = useState(false);
	const [error, setError] = useState(null);

	// TODO: Replace these with your actual EmailJS values from https://www.emailjs.com/
	const EMAILJS_SERVICE_ID = 'service_7ugsqbs';
	const EMAILJS_TEMPLATE_ID = 'template_q55l8yp';
	const EMAILJS_PUBLIC_KEY = 'aIJKJSFtAVhhKA7Cd';

	const onSubmit = async (data) => {
		setError(null);
		setSending(true);

		try {
			// 1) Save feedback in Supabase so it appears in Feedback Reports
			const { error: dbError } = await supabase
				.from('feedback')
				.insert({ message: data.message });

			if (dbError) {
				console.error('Failed to save feedback:', dbError);
				throw new Error('Failed to save feedback. Please try again.');
			}

			// 2) Optionally send email notification if EmailJS is configured
			if (
				EMAILJS_SERVICE_ID &&
				EMAILJS_TEMPLATE_ID &&
				EMAILJS_PUBLIC_KEY &&
				EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID'
			) {
				try {
					await emailjs.send(
						EMAILJS_SERVICE_ID,
						EMAILJS_TEMPLATE_ID,
						{
							message: data.message,
							to_email: 'HireSphere@gmail.com',
						},
						EMAILJS_PUBLIC_KEY
					);
				} catch (emailError) {
					console.warn('Feedback saved, but email notification failed:', emailError);
				}
			}

			setSubmitted(true);
			reset();
			setTimeout(() => setSubmitted(false), 5000);
		} catch (err) {
			console.error('Failed to submit feedback:', err);
			setError('Something went wrong while sending your feedback. Please try again later.');
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600">
      
		
			{/* MAIN CONTENT */}
			<main className="flex-1 flex justify-center items-center py-6 sm:py-12 px-4 sm:px-6">
				<div className="w-full max-w-4xl bg-white/5 backdrop-blur-md shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden grid md:grid-cols-2">
            
					{/* LEFT PANEL - Contact Info */}
					<div className="p-6 sm:p-8 bg-black/60 text-white flex flex-col justify-center order-2 md:order-1">
					
						<h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4">Contact HireSphere</h2>
						<p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-300">Reach out to us using the details below or send a message through the form.</p>

						<div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
							<div>
								<span className="font-semibold text-blue-400 block mb-1">Telephone Number:</span>
								<div className="text-gray-300 break-all">0999999999</div>
							</div>

							<div>
								<span className="font-semibold text-blue-400 block mb-1">Email Address:</span>
								<div>
									<a
										href="mailto:HireSphere@gmail.com"
										className="text-blue-400 hover:text-blue-300 underline break-all"
									>
										HireSphere@gmail.com
									</a>
								</div>
							</div>

							<div>
								<span className="font-semibold text-blue-400 block mb-1">Facebook:</span>
								<div>
									<a href="mailto:HireSphere@gmail.com" className="text-blue-400 hover:text-blue-300 underline break-all">
										HireSphere@gmail.com
									</a>
								</div>
							</div>
						</div>

						<div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400">
							<p>Office hours: Mon - Fri, 9:00 AM - 5:00 PM</p>
						</div>
					</div>

					{/* RIGHT PANEL - Contact Form */}
					<div className="p-6 sm:p-8 bg-white/90 order-1 md:order-2">
						<h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Feedback</h3>

						{error && (
							<div className="mb-4 p-2 sm:p-3 text-xs sm:text-sm bg-red-100 border border-red-400 text-red-700 rounded">
								{error}
							</div>
						)}

						{submitted && (
							<div className="mb-4 p-2 sm:p-3 text-xs sm:text-sm bg-blue-100 border border-blue-400 text-blue-700 rounded">
								✓ Thank you — your message has been received.
							</div>
						)}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<div>
								<label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Feedback / Suggestion</label>
								<Controller
									name="message"
									control={control}
									defaultValue=""
									rules={{ required: 'Please enter your feedback or suggestion.' }}
									render={({ field }) => (
										<textarea
											{...field}
											rows={5}
											className={`mt-1 block w-full rounded-lg border-2 ${errors.message ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 text-sm sm:text-base text-gray-900`}
											placeholder="Share your feedback or suggestion for HireSphere..."
										/>
									)}
								/>
								{errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message || errors.message}</p>}
							</div>

							<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 pt-2">
								<button
									type="submit"
									disabled={sending}
									className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 sm:py-3 border border-transparent text-xs sm:text-sm font-semibold rounded-lg shadow-md text-white transition ${
										sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
									}`}
								>
									{sending ? 'Sending...' : 'Send'}
								</button>
								<button type="button" onClick={() => { reset(); }} className="w-full sm:w-auto text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-medium text-center sm:text-left">
									Clear
								</button>
							</div>
						</form>
					</div>
				</div>
			</main>
			<Footer />
		</div>

	);
};

export default Contact;

