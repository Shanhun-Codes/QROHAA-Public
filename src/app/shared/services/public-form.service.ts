import { Injectable } from '@angular/core';
import { FormControl, FormRecord, Validators } from '@angular/forms';
import { FeedbackQuestion } from '../models/feedback-form-public-data.interface';
import { LeadFormField } from '../models/lead-form-public-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PublicFormService {
  public buildForm(
    leadFields: LeadFormField[],
    feedbackQuestions: FeedbackQuestion[],
  ): FormRecord<FormControl<string | null>> {
    const form = new FormRecord<FormControl<string | null>>({});

    for (const field of leadFields) {
      const validators = field.required ? [Validators.required] : [];

      if (field.type === 'EMAIL') {
        validators.push(Validators.email);
      }

      form.addControl(
        field.key,
        new FormControl<string | null>(null, validators),
      );
    }

    for (const question of feedbackQuestions) {
      form.addControl(
        question.key,
        new FormControl<string | null>(
          null,
          question.required ? Validators.required : [],
        ),
      );
    }

    return form;
  }
}