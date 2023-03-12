const templateIDs = {
  CHAPTER_INTEREST: process.env.SENDGRID_CHAPTER_INTEREST_TEMPLATE_ID,
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
};

module.exports = {
  send: async (ctx) => {
    const options = ctx.request.body;
    try {
      const email = await EmailTypes[options.form](options);
      await strapi.plugin("email").service("email").send({
        to: email.to,
        template_id: email.templateID,
        dynamic_template_data: email.data,
      });
    } catch (e) {
      strapi.log.error(`Error sending email to ${sendTo}`, err);
      ctx.send({ error: "Error sending email" });
    }
    ctx.send({ success: true });
  },
};
