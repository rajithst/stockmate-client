import React from "react";
import {Card, CardContent, CardHeader, CardTitle,} from "../ui/card.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs.tsx";

import {Badge} from "../ui/badge.tsx";


interface BaseNews {
    id: number;
    published_date: string;
    publisher?: string;
    title: string;
    text?: string;
    image?: string;
    url?: string;
}

interface CompanyGeneralNews extends BaseNews {
    site?: string;
}

interface CompanyPriceTargetNews extends BaseNews {
    analyst_name: string;
    price_target: number;
    adj_price_target?: number;
    price_when_posted: number;
    analyst_company?: string;
}

interface CompanyGradingNews extends BaseNews {
    new_grade: string;
    previous_grade?: string;
    grading_company?: string;
    action?: string;
    price_when_posted: number;
}

export interface CompanyNews {
    generalNews: CompanyGeneralNews[];
    priceTargetNews: CompanyPriceTargetNews[];
    gradingNews: CompanyGradingNews[];
}


export const CompanyNewsTabs: React.FC<{ news: CompanyNews }> = ({news}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Company News</CardTitle>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="target">Price Target</TabsTrigger>
                        <TabsTrigger value="grading">Grading</TabsTrigger>
                    </TabsList>

                    {/* General News */}
                    <TabsContent value="general">
                        <div className="space-y-3 mt-3">
                            {news.generalNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start space-x-3 hover:bg-muted p-2 rounded-md transition"
                                >
                                    {news.image && (
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{news.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {news.publisher} •{" "}
                                            {new Date(news.published_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Price Target News */}
                    <TabsContent value="target">
                        <div className="space-y-3 mt-3">
                            {news.priceTargetNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:bg-muted p-2 rounded-md transition"
                                >
                                    <div className="font-medium text-sm">{news.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {news.analyst_name} ({news.analyst_company}) •{" "}
                                        Target: ${news.price_target} •{" "}
                                        {new Date(news.published_date).toLocaleDateString()}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Grading News */}
                    <TabsContent value="grading">
                        <div className="space-y-3 mt-3">
                            {news.gradingNews.map((news) => (
                                <a
                                    key={news.id}
                                    href={news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:bg-muted p-2 rounded-md transition"
                                >
                                    <div className="font-medium text-sm">{news.title}</div>
                                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                                        <span>{news.grading_company}</span>•
                                        <span>
                                              {news.previous_grade && (
                                                  <>
                                                      {news.previous_grade} →{" "}
                                                  </>
                                              )}
                                            <Badge variant="secondary">{news.new_grade}</Badge>
                                        </span>
                                        <span>
                                          ({new Date(news.published_date).toLocaleDateString()})
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};