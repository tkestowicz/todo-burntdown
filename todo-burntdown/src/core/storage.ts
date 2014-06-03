export interface ISerializable{
    key: string;
    serialize(): any;
    deserialize(data: any)
} 

export interface IStorageApi {
    listeners: ISerializable[];
    save(): void;
    load(): void;
}

export class SessionStorage implements IStorageApi {
    
    private keyPrefix = "todo-burntdown.";

    listeners: ISerializable[] = [];

    save() {
        this.listeners.forEach(o => sessionStorage.setItem(this.keyPrefix + o.key, JSON.stringify(o.serialize())));
    }

    load() {
        this.listeners.forEach(o => {
            var data = sessionStorage.getItem(this.keyPrefix + o.key);

            if (data !== undefined && data !== null)
                o.deserialize(JSON.parse(data));
        });
    }
}