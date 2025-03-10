import { Exclude } from 'class-transformer'
import { Lang } from '../../lang/entities/lang.entity'
import { User } from '../../user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PartOfSpeech } from '../../part-of-speech/entities/part-of-speech.entity'
import { WordClass } from '../../word-class/entities/word-class.entity'

@Entity()
export class Word {
  @Exclude()
  @PrimaryGeneratedColumn()
  internal_id: number

  @Exclude()
  @ManyToOne(() => Lang, { onDelete: 'CASCADE'})
  lang: Lang

  @ManyToOne(() => User)
  creator: User

  @OneToOne(() => PartOfSpeech, { onDelete: 'CASCADE' })
  partOfSpeech: PartOfSpeech

  @ManyToMany(() => WordClass, { onDelete: 'CASCADE' })
  wordClasses: WordClass[]

  @Column()
  word: string

  @Column()
  ipa: string

  @Column()
  definition: string

  @Column()
  notes: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
