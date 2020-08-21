import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
/* import { getDaysInMonth, getDate } from 'date-fns'; */
import { getHours } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	day: number;
	month: number;
	year: number;
}
type IResponse = Array<{
	hour: number;
	available: boolean;
}>;
@injectable()
export default class ListDayAvailabilityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	/**
	 * execute
	 */
	public async execute({
		provider_id,
		month,
		year,
		day,
	}: IRequest): Promise<IResponse> {
		const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
			{
				provider_id,
				month,
				year,
				day,
			},
		);
		const hourStart = 8;
		const eachHourArray = Array.from(
			{ length: 10 },
			(_, index) => index + hourStart,
		);
		const availability = eachHourArray.map((hour) => {
			const hasAppointmentInHour = appointments.find(
				(appointment) => getHours(appointment.date) === hour,
			);
			return { hour, available: !hasAppointmentInHour };
		});
		return availability;
	}
}
