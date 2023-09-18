const templateIDs = {
  CHAPTER_INTEREST: process.env.SENDGRID_CHAPTER_INTEREST_TEMPLATE_ID,
  SITE_CONTACT_FORM: process.env.SENDGRID_CONTACT_FORM_TEMPLATE_ID,
};

const validators = {
  CHAPTER_INTEREST: (options) => {
    const errors = [];
    if (!options.data.fullName) errors.push("Full name is required");
    if (!options.data.email) errors.push("Email is required");
    if (!options.data.phone) errors.push("Phone is required");
    if (!options.chapter) errors.push("Chapter is required");
    return errors;
  },
  SITE_CONTACT_FORM: (options) => {
    const errors = [];
    if (!options.name) errors.push("Name is required");
    if (!options.email) errors.push("Email is required");
    if (!options.message) errors.push("Message is required");
    return errors;
  },
};

const EmailTypes = {
  CHAPTER_INTEREST: async (options) => {
    const chapter = await strapi.entityService.findMany(
      "api::chapter.chapter",
      {
        filters: { chapter_abbreviation: options.chapter },
      }
    );
    const emailObject = {
      to: chapter[0].email,
      templateID: templateIDs[options.form],
      data: {
        fullName: options.data.fullName,
        email: options.data.email,
        phone: options.data.phone,
        eligibilityQuestions: options.data.eligibilityQuestions,
      },
    };
    return emailObject;
  },
  SITE_CONTACT_FORM: async (options) => {
    const chapter = await strapi.entityService.findMany(
      "api::chapter.chapter",
      {
        filters: { chapter_abbreviation: options.chapter },
      }
    );
    const emailObject = {
      to: chapter[0].email,
      templateID: templateIDs[options.form],
      data: {
        name: options.name,
        email: options.email,
        telephone: options.telephone,
        message: options.message,
      },
    };
    return emailObject;
  },
};

module.exports = {
  send: async (ctx) => {
    let errors;
    const options = ctx.request.body;
    if (Object.keys(validators).includes(options.form)) {
      errors = validators[options.form](options);
    } else {
      return ctx.response.badRequest("Submission invalid. Cannot validate.");
    }
    if (errors.length)
      return ctx.response.badRequest("Your submission has errors", {
        errors: errors,
      });
    try {
      const email = await EmailTypes[options.form](options);
      await strapi.plugin("email").service("email").send({
        to: email.to,
        template_id: email.templateID,
        dynamic_template_data: email.data,
      });
    } catch (e) {
      strapi.log.error("Error sending email.", err);
      ctx.send({ error: "Error sending email" });
    }
    ctx.send({ success: true });
  },
};
