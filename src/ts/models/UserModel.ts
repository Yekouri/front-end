import { DataProviders } from "../store/Store";
import { ProducerModel, ProducerModelData } from "./ProducerModel";
import { ReceiverModel, ReceiverModelData } from "./ReceiverModel";

enum UserTypes {
    PRODUCER = "producer",
    RECEIVER = "receiver"
}

/**
 * Defines the data required to create a user model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type UserModelData = {
    id: number;
    email: string;
    firstName: string;
    surName: string;
    country: string;
    city: string;
    description: string;
    thumbnail: string;
    userType: UserTypes;
};
// tslint:enable completed-docs

/**
 * User model
 */
export class UserModel {
    /**
     * Helper that instantiates a user model, populated with required data.
     */
    public static async CREATE(dataProivder: DataProviders): Promise<UserModel> {
        if (dataProivder === DataProviders.BACKEND) {
            // Fetch data from backend
            const data = await import("../../assets/dummy/user.json");
            if (data.userType === UserTypes.PRODUCER) {
                return new ProducerModel(data as ProducerModelData);
            } else {
                return new ReceiverModel(data as ReceiverModelData);
            }
        } else {
            // Use dummydata
            const data = await import("../../assets/dummy/user.json");
            if (data.userType === UserTypes.PRODUCER) {
                return new ProducerModel(data as ProducerModelData);
            } else {
                return new ReceiverModel(data as ReceiverModelData);
            }
        }
    }

    /**
     * The id of the user
     */
    public readonly id: number;

    /**
     * The email adress of the user
     */
    public readonly email: string;

    /**
     * The first name of the user
     */
    public readonly firstName: string;

    /**
     * The surname of the user
     */
    public readonly surName: string;

    /**
     * The country the user lives in
     */
    public readonly country: string;

    /**
     * The city the user lives in
     */
    public readonly city: string;

    /**
     * The description of the user
     */
    public readonly description: string;

    /**
     * The path to the user's profile picture
     */
    public readonly thumbnail: string;

    constructor(data: UserModelData) {
        this.id = data.id;
        this.email = data.email;
        this.firstName = data.firstName;
        this.surName = data.surName;
        this.country = data.country;
        this.city = data.city;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
    }
}
