import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    BeforeInsert,
}
    from "typeorm";
import * as uuidv4 from "uuid/v4";

@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text")
    password: string;
    
    @Column("boolean", { default: false })
    confirmed: boolean;

    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }


}
