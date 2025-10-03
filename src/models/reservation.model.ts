export interface ReservationModel {
    flightId: number,
    airline: string,
    suite: string,
    createdAt: Date,
    updatedAt: Date | null,
    status: 'paid' | 'waiting' | 'canceled' | 'liked' | 'disliked'
}